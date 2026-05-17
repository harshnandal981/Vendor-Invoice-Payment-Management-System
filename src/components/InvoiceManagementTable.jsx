import { ArrowUpDown, Eye, Pencil, ShieldCheck, Trash2 } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { downloadCsv } from '../utils/downloadCsv'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function InvoiceManagementTable({ invoices = [], isLoading, onView, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Invoice register</p>
          <p className="text-xs text-slate-500">Manage invoice lifecycle stages</p>
        </div>
        <button onClick={() => downloadCsv('invoices.csv', invoices.map((invoice) => ({ Vendor: invoice.vendor, Invoice: invoice.number, Amount: invoice.amount, DueDate: invoice.dueDate, Status: invoice.status })))} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
          <ArrowUpDown size={15} />
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.22em] text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Vendor</th>
              <th className="px-5 py-4 font-semibold">Invoice</th>
              <th className="px-5 py-4 font-semibold">Amount</th>
              <th className="px-5 py-4 font-semibold">Due date</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-t border-slate-100">
                  <td colSpan={6} className="px-5 py-5">
                    <div className="grid animate-pulse grid-cols-6 gap-3">
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-6 rounded-full bg-slate-200" />
                      <div className="h-8 rounded-2xl bg-slate-200" />
                    </div>
                  </td>
                </tr>
              ))
            ) : invoices.length === 0 ? (
              <tr className="border-t border-slate-100">
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                  No invoices found. Upload a PDF to start the workflow.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-slate-100 align-top transition hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{invoice.vendor}</p>
                    <p className="mt-1 text-xs text-slate-500">Uploaded by {invoice.uploadedBy || 'System'}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    <p>{invoice.number}</p>
                    <p className="mt-1 text-xs text-slate-400">{invoice.updatedAt || invoice.createdAt || 'New'}</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-900">{currency.format(Number(invoice.amount || 0))}</td>
                  <td className="px-5 py-4 text-slate-600">{invoice.dueDate}</td>
                  <td className="px-5 py-4"><StatusBadge status={invoice.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => onView?.(invoice)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                        <Eye size={14} />
                        View
                      </button>
                      <button onClick={() => onEdit?.(invoice)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button onClick={() => onStatusChange?.(invoice, 'under verification')} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                        <ShieldCheck size={14} />
                        Verify
                      </button>
                      <button onClick={() => onStatusChange?.(invoice, 'approved')} disabled={invoice.status === 'paid'} className="rounded-2xl bg-[#0f1115] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">
                        Approve
                      </button>
                      <button onClick={() => onStatusChange?.(invoice, 'paid')} disabled={!['approved', 'scheduled'].includes(invoice.status)} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 disabled:opacity-40">
                        Mark paid
                      </button>
                      <button onClick={() => onDelete?.(invoice)} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
