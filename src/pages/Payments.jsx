import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppData } from '../context/AppDataContext'
import PaymentTable from '../components/PaymentTable'
import KpiCard from '../components/KpiCard'
import { Banknote, CircleDollarSign, Clock3 } from 'lucide-react'

export default function Payments() {
  const { payments, isSyncing, markPaymentPaid, searchQuery } = useAppData()
  const [error, setError] = useState('')

  const filteredPayments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return payments
    return payments.filter((payment) => [payment.vendor, payment.invoiceNumber, payment.method, payment.status].join(' ').toLowerCase().includes(q))
  }, [payments, searchQuery])

  const completed = filteredPayments.filter((payment) => payment.status === 'paid').length
  const scheduled = filteredPayments.filter((payment) => payment.status === 'scheduled').length
  const total = filteredPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)

  const handleMarkPaid = async (payment) => {
    try {
      await markPaymentPaid(payment.id)
    } catch {
      setError('Unable to update payment right now.')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Payments</p>
        <h1 className="mt-2 font-[Poppins] text-3xl font-semibold text-slate-900">Treasury payout tracking</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">Monitor scheduled payouts, released funds, and treasury throughput.</p>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard title="Total payouts" value={`$${total.toLocaleString()}`} delta="Across filtered payments" tone="gold" icon={Banknote} />
        <KpiCard title="Scheduled" value={`${scheduled}`} delta="Pending release" tone="amber" icon={Clock3} />
        <KpiCard title="Completed" value={`${completed}`} delta="Successfully paid" tone="rose" icon={CircleDollarSign} />
      </div>

      {isSyncing ? <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Refreshing payment data...</p> : null}

      <PaymentTable payments={filteredPayments} onMarkPaid={handleMarkPaid} isLoading={isSyncing} />
    </motion.div>
  )
}
