import { useMemo } from 'react'
import { CheckCircle2, RefreshCw } from 'lucide-react'
import { downloadCsv } from '../utils/downloadCsv'

const statusStyles = {
  scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function PaymentTable({ payments = [], onMarkPaid, isLoading }) {
  const totals = useMemo(() => {
    const paid = payments.filter((payment) => payment.status === 'paid').length
    const scheduled = payments.filter((payment) => payment.status === 'scheduled').length
    const total = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
    return { paid, scheduled, total }
  }, [payments])

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Payment tracking</p>
          <p className="text-xs text-slate-500">Treasury status and payout health</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{totals.paid} paid</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{totals.scheduled} scheduled</span>
          <button onClick={() => downloadCsv('payments.csv', payments.map((payment) => ({ Vendor: payment.vendor, Invoice: payment.invoiceNumber, Amount: payment.amount, Method: payment.method, Status: payment.status })))} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50">
            <RefreshCw size={15} />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.22em] text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Vendor</th>
              <th className="px-5 py-4 font-semibold">Invoice</th>
              <th className="px-5 py-4 font-semibold">Amount</th>
              <th className="px-5 py-4 font-semibold">Method</th>
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
            ) : payments.length === 0 ? (
              <tr className="border-t border-slate-100">
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                  No payments scheduled yet.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{payment.vendor}</p>
                      <p className="text-xs text-slate-500">{payment.date}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{payment.invoiceNumber}</td>
                  <td className="px-5 py-4 font-medium text-slate-900">{currency.format(Number(payment.amount || 0))}</td>
                  <td className="px-5 py-4 text-slate-600">{payment.method}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusStyles[payment.status] || 'border-slate-200 text-slate-600'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onMarkPaid?.(payment)}
                      disabled={payment.status !== 'scheduled'}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#0f1115] px-3 py-2 text-xs font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <CheckCircle2 size={14} />
                      Mark paid
                    </button>
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
