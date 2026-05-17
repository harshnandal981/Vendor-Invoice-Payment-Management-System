import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileUp, ImagePlus, LoaderCircle, X } from 'lucide-react'
import { parseInvoiceWithGemini } from '../services/gemini'

const initialForm = {
  vendorName: '',
  invoiceNumber: '',
  amount: '',
  dueDate: '',
  tax: '',
  description: '',
  confidence: 0,
  warnings: [],
}

export default function UploadInvoiceModal({ open, onClose, onUpload, isUploading }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState(initialForm)
  const [isParsing, setIsParsing] = useState(false)

  const parseFile = async (nextFile) => {
    setIsParsing(true)
    setError('')
    try {
      const extraction = await parseInvoiceWithGemini(nextFile)
      setForm({
        vendorName: extraction.vendorName || '',
        invoiceNumber: extraction.invoiceNumber || '',
        amount: extraction.amount || '',
        dueDate: extraction.dueDate || '',
        tax: extraction.tax || '',
        description: extraction.description || '',
        confidence: extraction.confidence || 0,
        warnings: extraction.warnings || [],
      })
    } catch {
      setError('Unable to parse this file right now.')
    } finally {
      setIsParsing(false)
    }
  }

  const handleFileChange = async (nextFile) => {
    setFile(nextFile)
    if (nextFile) {
      await parseFile(nextFile)
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Select a PDF or image to upload.')
      return
    }

    if (!form.vendorName || !form.invoiceNumber) {
      setError('Vendor name and invoice number are required.')
      return
    }

    setError('')
    await onUpload({
      file,
      extractionOverrides: {
        vendorName: form.vendorName,
        invoiceNumber: form.invoiceNumber,
        amount: Number(form.amount || 0),
        dueDate: form.dueDate,
        tax: Number(form.tax || 0),
        description: form.description,
        confidence: Number(form.confidence || 0),
        warnings: form.warnings,
      },
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 px-4 py-4 sm:items-center"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/20 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-[#fffdf7] to-white px-6 py-5">
              <div>
                <p className="text-lg font-semibold text-slate-900">Upload invoice</p>
                <p className="text-sm text-slate-500">Parse first, then correct fields before saving.</p>
              </div>
              <button onClick={onClose} className="rounded-full border border-slate-200 p-2 transition hover:bg-slate-50">
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-10 text-center transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:shadow-[0_18px_45px_rgba(15,17,21,0.06)]">
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    className="hidden"
                    onChange={(event) => handleFileChange(event.target.files?.[0] || null)}
                  />
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f1115] text-white shadow-[0_14px_30px_rgba(15,17,21,0.18)]">
                    <FileUp size={20} />
                  </div>
                  <p className="mt-4 font-[Poppins] text-base font-semibold text-slate-900">Drop file here or browse</p>
                  <p className="mt-1 text-sm text-slate-500">Invoice PDF, JPG, or PNG</p>
                  {file ? (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                      <ImagePlus size={15} className="text-[#D4AF37]" />
                      {file.name}
                    </div>
                  ) : null}
                </label>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">Extraction confidence</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{Math.round(Number(form.confidence || 0) * 100)}%</p>
                  {form.warnings?.length ? (
                    <ul className="mt-3 space-y-1 text-xs text-amber-700">
                      {form.warnings.map((warning) => <li key={warning}>• {warning}</li>)}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">No extraction warnings.</p>
                  )}
                </div>
              </div>

              <div className="p-6">
                {isParsing ? (
                  <div className="flex h-full min-h-72 items-center justify-center rounded-[28px] border border-slate-100 bg-slate-50 text-slate-500">
                    <LoaderCircle size={18} className="mr-2 animate-spin" />
                    Parsing invoice fields...
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-600">
                      Vendor name
                      <input value={form.vendorName} onChange={(event) => setForm((current) => ({ ...current, vendorName: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      Invoice number
                      <input value={form.invoiceNumber} onChange={(event) => setForm((current) => ({ ...current, invoiceNumber: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      Amount
                      <input type="number" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      Due date
                      <input type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      Tax
                      <input type="number" value={form.tax} onChange={(event) => setForm((current) => ({ ...current, tax: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      Confidence
                      <input type="number" min="0" max="1" step="0.01" value={form.confidence} onChange={(event) => setForm((current) => ({ ...current, confidence: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600 sm:col-span-2">
                      Description
                      <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={5} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#D4AF37]" />
                    </label>
                  </div>
                )}

                {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

                <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                  <button onClick={onClose} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isUploading || isParsing}
                    className="rounded-2xl bg-[#0f1115] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(15,17,21,0.18)] transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUploading ? 'Saving invoice...' : 'Save invoice'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
