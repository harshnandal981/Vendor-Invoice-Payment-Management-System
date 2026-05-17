import { CheckCircle2, RefreshCw, XCircle } from 'lucide-react'
import { downloadCsv } from '../utils/downloadCsv'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function ApprovalQueue({ approvals = [], onApprove, onReject, isLoading }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Approval queue</p>
          <p className="text-xs text-slate-500">Work verification and finance sign-off</p>
        </div>
        <button onClick={() => downloadCsv('approvals.csv', approvals.map((approval) => ({ Vendor: approval.vendor, Invoice: approval.invoiceNumber, Amount: approval.amount, DueDate: approval.dueDate, Status: approval.status })))} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
          <RefreshCw size={15} />
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
              <th className="px-5 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="border-t border-slate-100">
                  <td colSpan={6} className="px-5 py-5">
                    <div className="grid animate-pulse grid-cols-6 gap-3">
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-8 rounded-2xl bg-slate-200" />
                    </div>
                  </td>
                </tr>
              ))
            ) : approvals.length === 0 ? (
              <tr className="border-t border-slate-100">
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                  No approvals waiting right now.
                </td>
              </tr>
            ) : (
              approvals.map((approval) => (
                <tr key={approval.id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{approval.vendor}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{approval.invoiceNumber}</td>
                  <td className="px-5 py-4 font-medium text-slate-900">${Number(approval.amount || 0).toLocaleString()}</td>
                  <td className="px-5 py-4 text-slate-600">{approval.dueDate}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusStyles[approval.status] || 'border-slate-200 text-slate-600'}`}>
                      {approval.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => onApprove?.(approval)} disabled={approval.status !== 'pending'} className="inline-flex items-center gap-2 rounded-2xl bg-[#0f1115] px-3 py-2 text-xs font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40">
                        <CheckCircle2 size={14} />
                        Approve
                      </button>
                      <button onClick={() => onReject?.(approval)} disabled={approval.status !== 'pending'} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                        <XCircle size={14} />
                        Reject
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
