import { useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import StatusPill from './StatusPill'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function InvoiceTable({ invoices = [], onStatusChange, searchQuery = '' }) {
  const [sortKey, setSortKey] = useState('dueDate')
  const [sortDirection, setSortDirection] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const search = searchQuery.trim().toLowerCase()
    const data = invoices.filter((invoice) => {
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
      const matchesSearch = !search || [invoice.vendor, invoice.number, invoice.status].join(' ').toLowerCase().includes(search)
      return matchesStatus && matchesSearch
    })

    return [...data].sort((a, b) => {
      const left = a[sortKey]
      const right = b[sortKey]
      const direction = sortDirection === 'asc' ? 1 : -1

      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * direction
      }

      return String(left || '').localeCompare(String(right || '')) * direction
    })
  }, [invoices, searchQuery, sortDirection, sortKey, statusFilter])

  const toggleDirection = () => setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))

  return (
    <div className="min-w-0 rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div>
          <p className="text-sm font-semibold text-slate-900">Recent invoices</p>
          <p className="text-xs text-slate-500">Filter, sort, and update invoice status</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-9 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none transition focus:border-[#D4AF37]"
          >
            <option value="all">All statuses</option>
            <option value="received">Received</option>
            <option value="under verification">Under verification</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
            className="h-9 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none transition focus:border-[#D4AF37]"
          >
            <option value="dueDate">Due date</option>
            <option value="amount">Amount</option>
            <option value="vendor">Vendor</option>
            <option value="status">Status</option>
          </select>
          <button
            onClick={toggleDirection}
            className="inline-flex h-9 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowUpDown size={15} />
            Sort
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full table-fixed text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="w-[18%] px-4 py-4 font-semibold sm:px-5">Vendor</th>
              <th className="w-[12%] px-4 py-4 font-semibold sm:px-5">Invoice ID</th>
              <th className="w-[10%] px-4 py-4 font-semibold sm:px-5">Amount</th>
              <th className="w-[10%] px-4 py-4 font-semibold sm:px-5">Due Date</th>
              <th className="w-[12%] px-4 py-4 font-semibold sm:px-5">Status</th>
              <th className="w-[38%] px-4 py-4 font-semibold sm:px-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                  No invoices match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((invoice) => (
                <tr key={invoice.id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                  <td className="px-4 py-4 sm:px-5">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{invoice.vendor}</p>
                      <p className="text-xs text-slate-500">{invoice.aiStatus || 'AI extracted'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 sm:px-5">{invoice.number}</td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-900 sm:px-5">{currency.format(Number(invoice.amount || 0))}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 sm:px-5">{invoice.dueDate}</td>
                  <td className="px-4 py-4 sm:px-5"><StatusPill status={invoice.status} /></td>
                  <td className="px-4 py-4 sm:px-5">
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => onStatusChange?.(invoice, 'under verification')} className="rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-[#D4AF37] hover:text-[#0f1115]">
                        Verify
                      </button>
                      <button onClick={() => onStatusChange?.(invoice, 'approved')} className="rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-[#D4AF37] hover:text-[#0f1115]">
                        Approve
                      </button>
                      <button onClick={() => onStatusChange?.(invoice, 'paid')} className="rounded-2xl bg-[#0f1115] px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-black">
                        Mark paid
                      </button>
                      <button onClick={() => onStatusChange?.(invoice, 'overdue')} className="rounded-2xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100">
                        Overdue
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
