import { createInvoice } from './invoiceService'
import { logActivity } from './activityLogService'
import { parseInvoiceWithGemini } from './gemini'
import { storage } from '../lib/firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const STORAGE_KEY = 'vendorpay:invoice-files'

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('File read failed'))
    reader.readAsDataURL(file)
  })

const saveFileToBrowserStorage = async (file) => {
  const dataUrl = await readFileAsDataUrl(file)
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  const fileId = `${Date.now()}-${file.name}`
  existing[fileId] = {
    name: file.name,
    type: file.type,
    dataUrl,
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  return { fileId, fileUrl: dataUrl }
}

const uploadFile = async (file, onProgress) => {
  if (!storage) return saveFileToBrowserStorage(file)

  const fileId = `${Date.now()}-${file.name}`
  const fileRef = ref(storage, `invoices/${fileId}`)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(fileRef, file)
    task.on(
      'state_changed',
      (snapshot) => {
        const progress = snapshot.totalBytes ? snapshot.bytesTransferred / snapshot.totalBytes : 0
        onProgress?.(progress)
      },
      reject,
      async () => {
        const fileUrl = await getDownloadURL(task.snapshot.ref)
        resolve({ fileId, fileUrl })
      }
    )
  })
}

export async function uploadInvoiceAndExtract({ file, uploadedBy = 'vendor', extractionOverrides = {}, existingInvoices = [], onProgress }) {
  const { fileId, fileUrl } = await uploadFile(file, onProgress)

  const extraction = await parseInvoiceWithGemini(file)
  const normalizedExtraction = {
    ...extraction,
    ...extractionOverrides,
  }

  const duplicate = existingInvoices.find((invoice) =>
    invoice.number?.toLowerCase() === normalizedExtraction.invoiceNumber?.toLowerCase() &&
    invoice.vendor?.toLowerCase() === normalizedExtraction.vendorName?.toLowerCase()
  )

  const invoicePayload = {
    vendor: normalizedExtraction.vendorName,
    number: normalizedExtraction.invoiceNumber,
    amount: Number(normalizedExtraction.amount || 0),
    dueDate: normalizedExtraction.dueDate,
    status: 'received',
    aiStatus: duplicate ? 'duplicate warning' : 'extracted',
    description: normalizedExtraction.description || '',
    tax: Number(normalizedExtraction.tax || 0),
    confidence: normalizedExtraction.confidence || 0.62,
    warnings: normalizedExtraction.warnings || [],
    duplicateOf: duplicate?.id || null,
    fileUrl,
    fileName: file.name,
    fileId,
    uploadedBy,
  }

  const invoiceId = await createInvoice(invoicePayload)

  await logActivity({
    title: `Invoice ${normalizedExtraction.invoiceNumber} uploaded`,
    meta: duplicate ? `Duplicate detected for ${normalizedExtraction.vendorName}` : `AI extraction ${normalizedExtraction.vendorName}`,
  })

  return { invoiceId, ...invoicePayload }
}
