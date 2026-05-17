import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Save, Trash2, X } from 'lucide-react'

export default function VendorModal({ open, vendor, onClose, onSave, onDelete, isSaving }) {
  const [form, setForm] = useState({
    name: vendor?.name || '',
    company: vendor?.company || '',
    category: vendor?.category || '',
    contact: vendor?.contact || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    gstNumber: vendor?.gstNumber || '',
    paymentMethod: vendor?.paymentMethod || 'bank transfer',
    bankDetails: vendor?.bankDetails || '',
    activeProjects: vendor?.activeProjects || '',
    pendingAmount: vendor?.pendingAmount || 0,
    totalPaid: vendor?.totalPaid || 0,
    risk: vendor?.risk || 'medium',
    outstanding: vendor?.outstanding || 0,
    id: vendor?.id,
  })
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Vendor name and email are required.')
      return
    }

    setError('')
    await onSave({
      ...vendor,
      ...form,
      outstanding: Number(form.outstanding || 0),
    })
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
            initial={{ y: 28, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/20 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-[#fffdf7] to-white px-6 py-5">
              <div>
                <p className="text-lg font-semibold text-slate-900">{vendor?.id ? 'Edit vendor' : 'Add vendor'}</p>
                <p className="text-sm text-slate-500">Update vendor master data and risk signal.</p>
              </div>
              <button onClick={onClose} className="rounded-full border border-slate-200 p-2 transition hover:bg-slate-50" aria-label="Close vendor editor">
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-600">
                Vendor name
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Company
                <input value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Category
                <input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Contact person
                <input value={form.contact} onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Email
                <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Phone
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                GST number
                <input value={form.gstNumber} onChange={(event) => setForm((current) => ({ ...current, gstNumber: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Risk level
                <select value={form.risk} onChange={(event) => setForm((current) => ({ ...current, risk: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Payment method
                <input value={form.paymentMethod} onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Active projects
                <input value={form.activeProjects} onChange={(event) => setForm((current) => ({ ...current, activeProjects: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600 sm:col-span-2">
                Bank details
                <input value={form.bankDetails} onChange={(event) => setForm((current) => ({ ...current, bankDetails: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Outstanding balance
                <input type="number" min="0" value={form.outstanding} onChange={(event) => setForm((current) => ({ ...current, outstanding: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Total paid
                <input type="number" min="0" value={form.totalPaid} onChange={(event) => setForm((current) => ({ ...current, totalPaid: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]" />
              </label>
            </div>

            {error ? <p className="px-6 text-sm text-rose-600">{error}</p> : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-5">
              <div>
                {vendor?.id ? (
                  <button onClick={async () => {
                    await onDelete?.(vendor.id)
                    onClose()
                  }} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                    <Trash2 size={16} />
                    Delete vendor
                  </button>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={onClose} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Cancel
                </button>
                <button onClick={submit} disabled={isSaving} className="inline-flex items-center gap-2 rounded-2xl bg-[#0f1115] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save vendor'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
