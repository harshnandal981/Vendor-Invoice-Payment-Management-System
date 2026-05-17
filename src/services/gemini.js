export const buildInvoiceExtractionPrompt = () =>
  'Extract vendor name, invoice number, amount, due date, tax, description, and confidence from the invoice file.'

const fallbackExtraction = (file) => {
  const baseName = file?.name?.replace(/\.[^.]+$/, '') || 'invoice'
  const invoiceMatch = baseName.match(/([A-Z]{2,5}[-_]?\d{3,6})/i)
  const vendorGuess = baseName
    .replace(invoiceMatch?.[0] || '', '')
    .replace(/[_-]+/g, ' ')
    .trim()

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 14)

  return {
    invoiceNumber: invoiceMatch?.[0]?.replace('_', '-') || `INV-${Date.now().toString().slice(-5)}`,
    amount: 0,
    dueDate: dueDate.toISOString().slice(0, 10),
    vendorName: vendorGuess || 'New vendor',
    tax: 0,
    description: `Imported from ${file?.name || 'uploaded file'}`,
    confidence: 0.62,
    warnings: ['Review extracted values before saving.'],
  }
}

export async function parseInvoiceWithGemini(file) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    return fallbackExtraction(file)
  }

  try {
    const buffer = await file.arrayBuffer()
    const bytes = Array.from(new Uint8Array(buffer))
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${buildInvoiceExtractionPrompt()} Return JSON with keys vendorName, invoiceNumber, amount, dueDate, tax, description, confidence, warnings.` },
              {
                inlineData: {
                  mimeType: file.type || 'application/pdf',
                  data: btoa(String.fromCharCode(...bytes)),
                },
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('Gemini extraction request failed')
    }

    const payload = await response.json()
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}')
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1))
    return {
      ...fallbackExtraction(file),
      ...parsed,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.81,
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    }
  } catch {
    return fallbackExtraction(file)
  }
}
