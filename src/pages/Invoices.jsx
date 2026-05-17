import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import InvoiceManagementTable from '../components/InvoiceManagementTable'
import { useAppData } from '../context/AppDataContext'

export default function Invoices() {
  const { invoices, isSyncing, changeInvoiceStatus, openUpload, searchQuery, saveInvoiceEdits, removeInvoiceById, pushToast } = useAppData()
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ status: 'all', vendor: 'all', amount: 'all' })

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return invoices.filter((invoice) => {
      const matchesSearch = !q || [invoice.vendor, invoice.number, invoice.status, invoice.dueDate].join(' ').toLowerCase().includes(q)
      const matchesStatus = filters.status === 'all' || invoice.status === filters.status
      const matchesVendor = filters.vendor === 'all' || invoice.vendor === filters.vendor
      const amountValue = Number(invoice.amount || 0)
      const matchesAmount =
        filters.amount === 'all' ||
        (filters.amount === 'lt5k' && amountValue < 5000) ||
        (filters.amount === '5kto15k' && amountValue >= 5000 && amountValue <= 15000) ||
        (filters.amount === 'gt15k' && amountValue > 15000)
      return matchesSearch && matchesStatus && matchesVendor && matchesAmount
    })
  }, [filters.amount, filters.status, filters.vendor, invoices, searchQuery])

  const handleStatusChange = async (invoice, status) => {
    try {
      await changeInvoiceStatus(invoice.id, status)
    } catch {
      setError('Invoice update failed. Check Firestore permissions.')
    }
  }

  const handleEdit = async (invoice) => {
    const updatedAmount = window.prompt(`Update amount for ${invoice.number}`, invoice.amount)
    if (updatedAmount === null) return
    try {
      await saveInvoiceEdits(invoice.id, { amount: Number(updatedAmount || 0) })
    } catch {
      setError('Invoice edit failed.')
    }
  }

  const handleDelete = async (invoice) => {
    const confirmed = window.confirm(`Delete invoice ${invoice.number}?`)
    if (!confirmed) return
    try {
      await removeInvoiceById(invoice.id)
    } catch {
      setError('Invoice deletion failed.')
    }
  }

  const handleView = (invoice) => {
    if (invoice.fileUrl) {
      window.open(invoice.fileUrl, '_blank', 'noopener,noreferrer')
    } else {
      pushToast('Preview unavailable', 'This invoice does not have a stored file.', 'warning')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Invoices</p>
          <h2 className="mt-2 font-[Poppins] text-2xl font-semibold text-slate-900">
            Invoice pipeline
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Track vendor invoices from receipt to payment in one workspace.
          </p>
        </div>
        <button
          onClick={openUpload}
          className="rounded-2xl bg-[#0f1115] px-4 py-3 text-xs font-semibold text-white shadow-[0_16px_30px_rgba(15,17,21,0.15)] transition hover:-translate-y-0.5 hover:bg-black"
        >
          Upload invoice
        </button>
      </div>

      {error ? <p className="text-xs text-amber-700">{error}</p> : null}

      <div className="grid gap-3 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_55px_rgba(15,17,21,0.07)] md:grid-cols-3">
        <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#D4AF37]">
          <option value="all">All statuses</option>
          <option value="received">Received</option>
          <option value="under verification">Under verification</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <select value={filters.vendor} onChange={(event) => setFilters((current) => ({ ...current, vendor: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#D4AF37]">
          <option value="all">All vendors</option>
          {[...new Set(invoices.map((invoice) => invoice.vendor))].map((vendor) => <option key={vendor} value={vendor}>{vendor}</option>)}
        </select>
        <select value={filters.amount} onChange={(event) => setFilters((current) => ({ ...current, amount: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#D4AF37]">
          <option value="all">All amounts</option>
          <option value="lt5k">Below $5k</option>
          <option value="5kto15k">$5k to $15k</option>
          <option value="gt15k">Above $15k</option>
        </select>
      </div>

      <InvoiceManagementTable
        invoices={filteredInvoices}
        isLoading={isSyncing && filteredInvoices.length === 0}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </motion.div>
  )
}
