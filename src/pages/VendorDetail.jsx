import { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppData } from '../context/AppDataContext'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function VendorDetail() {
  const navigate = useNavigate()
  const { vendorId } = useParams()
  const { vendors, invoices, payments, openVendorEditor } = useAppData()

  const vendor = vendors.find((entry) => entry.id === vendorId)
  const vendorInvoices = useMemo(() => invoices.filter((invoice) => invoice.vendor === vendor?.name), [invoices, vendor?.name])
  const vendorPayments = useMemo(() => payments.filter((payment) => payment.vendor === vendor?.name), [payments, vendor?.name])

  if (!vendor) {
    return <Navigate to="/vendors" replace />
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Vendor detail</p>
          <h1 className="mt-2 font-[Poppins] text-3xl font-semibold text-slate-900">{vendor.name}</h1>
          <p className="mt-2 text-sm text-slate-500">{vendor.email} · {vendor.phone}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/vendors')} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Back</button>
          <button onClick={() => openVendorEditor(vendor)} className="rounded-2xl bg-[#0f1115] px-4 py-3 text-sm font-semibold text-white">Edit vendor</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Outstanding</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{currency.format(Number(vendor.outstanding || 0))}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Invoices</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{vendorInvoices.length}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Paid to date</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{currency.format(vendorPayments.reduce((sum, item) => sum + Number(item.amount || 0), 0))}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
          <p className="text-sm font-semibold text-slate-900">Invoice history</p>
          <div className="mt-4 space-y-3">
            {vendorInvoices.map((invoice) => (
              <div key={invoice.id} className="rounded-2xl border border-slate-100 px-4 py-3">
                <p className="font-medium text-slate-900">{invoice.number}</p>
                <p className="mt-1 text-sm text-slate-500">{invoice.dueDate} · {currency.format(Number(invoice.amount || 0))} · {invoice.status}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
          <p className="text-sm font-semibold text-slate-900">Payment history</p>
          <div className="mt-4 space-y-3">
            {vendorPayments.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-slate-100 px-4 py-3">
                <p className="font-medium text-slate-900">{payment.invoiceNumber}</p>
                <p className="mt-1 text-sm text-slate-500">{payment.date || payment.paymentDate || 'Pending'} · {payment.method} · {payment.status}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  )
}
