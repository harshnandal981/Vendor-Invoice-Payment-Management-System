import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarCheck, FileText, ShieldCheck, Wallet } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import AnalyticsPanel from '../components/AnalyticsPanel'
import AlertPanel from '../components/AlertPanel'
import ActivityTimeline from '../components/ActivityTimeline'
import InvoiceTable from '../components/InvoiceTable'
import KpiCard from '../components/KpiCard'
import VendorCard from '../components/VendorCard'
import SkeletonBlock from '../components/SkeletonBlock'

const kpiCards = [
  { key: 'totalVendors', title: 'Total Vendors', icon: FileText, tone: 'gold' },
  { key: 'pendingApprovals', title: 'Pending Approvals', icon: CalendarCheck, tone: 'amber' },
  { key: 'pendingPayments', title: 'Pending Payments', icon: Wallet, tone: 'dark' },
  { key: 'paidThisMonth', title: 'Paid This Month', icon: ShieldCheck, tone: 'rose' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { vendors, invoices, payments, summary, alerts, timeline, isSyncing, searchQuery, changeInvoiceStatus, sync } = useAppData()

  const trendData = useMemo(() => {
    const buckets = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - index))
      return {
        key: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        count: 0,
      }
    })

    invoices.forEach((invoice) => {
      const sourceDate = invoice.createdAt || invoice.dueDate
      const parsedDate = sourceDate ? new Date(sourceDate) : null
      if (parsedDate && !Number.isNaN(parsedDate.getTime())) {
        const bucket = buckets.find((entry) => entry.key === parsedDate.toISOString().slice(0, 10))
        if (bucket) bucket.count += 1
      }
    })

    return buckets.map(({ label, count }) => ({ label, count }))
  }, [invoices])

  const paymentData = useMemo(() => {
    const paid = payments.filter((payment) => payment.status === 'paid').length
    const scheduled = payments.filter((payment) => payment.status === 'scheduled').length
    const failed = payments.filter((payment) => payment.status === 'overdue' || payment.status === 'failed').length

    return [
      { label: 'Paid', value: paid },
      { label: 'Scheduled', value: scheduled },
      { label: 'Failed', value: failed },
    ]
  }, [payments])

  const dashboardKpis = [
    { ...summary, key: 'totalVendors', value: summary.totalVendors.toString(), delta: `${summary.totalVendors} active vendors` },
    { ...summary, key: 'pendingApprovals', value: summary.pendingApprovals.toString(), delta: `${summary.pendingApprovals} awaiting founder sign-off` },
    { ...summary, key: 'pendingPayments', value: summary.pendingPayments.toString(), delta: 'Queued for treasury release' },
    { ...summary, key: 'paidThisMonth', value: `$${summary.paidThisMonth.toLocaleString()}`, delta: 'Paid in current cycle' },
  ]

  const spotlightVendors = vendors.slice(0, 4)
  const recentInvoices = invoices.slice(0, 8)
  const overdueAlerts = alerts.overdueInvoices
  const approvalAlerts = alerts.missingApprovals
  const duplicateAlerts = alerts.duplicateWarnings

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0 space-y-6 sm:space-y-8">
      <section className="min-w-0 rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.07)] sm:p-6 xl:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#fff9e7] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a641c]">
              Premium SaaS dashboard
              <ArrowUpRight size={14} />
            </div>
            <h1 className="mt-4 font-[Poppins] text-[22px] font-semibold tracking-tight text-slate-900 sm:text-[25px]">
              Vendor invoice payment command center
            </h1>
            <p className="mt-3 max-w-2xl text-[12px] leading-5 text-slate-500 sm:text-[13px]">
              Monitor incoming invoices, approvals, treasury activity, and risk alerts in a single operational workspace.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:w-full lg:max-w-[320px]">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Live sync</p>
              <p className="mt-2 text-[15px] font-semibold text-slate-900">{isSyncing ? 'Syncing...' : 'Connected'}</p>
            </div>
            <button onClick={sync} className="rounded-3xl bg-[#0f1115] px-4 py-4 text-left text-white shadow-[0_18px_45px_rgba(15,17,21,0.15)] transition hover:-translate-y-0.5 hover:bg-black">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">Refresh</p>
              <p className="mt-2 text-[15px] font-semibold">Pull latest data</p>
            </button>
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {dashboardKpis.map((metric, index) => (
          isSyncing ? (
            <div key={metric.key} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="mt-4 h-10 w-32" />
              <SkeletonBlock className="mt-3 h-4 w-40" />
            </div>
          ) : (
            <KpiCard
              key={metric.key}
              title={kpiCards[index].title}
              value={metric.value}
              delta={metric.delta}
              tone={kpiCards[index].tone}
              icon={kpiCards[index].icon}
            />
          )
        ))}
      </section>

      <AnalyticsPanel trendData={trendData} paymentData={paymentData} />

      <section className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
        <InvoiceTable
          invoices={recentInvoices}
          searchQuery={searchQuery}
          onStatusChange={changeInvoiceStatus}
        />
        <AlertPanel
          overdueInvoices={overdueAlerts}
          missingApprovals={approvalAlerts}
          duplicateWarnings={duplicateAlerts}
          onRefresh={sync}
          onFilter={() => navigate('/alerts')}
          filterLabel="Open alerts"
        />
      </section>

      <section className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="min-w-0 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.07)] sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Vendor spotlight</p>
              <p className="text-xs text-slate-500">Operational profile cards with risk signal</p>
            </div>
            <Link to="/vendors" className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#D4AF37] hover:text-slate-900">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {spotlightVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} onViewProfile={() => navigate(`/vendors/${vendor.id}`)} />
            ))}
          </div>
        </div>

        <ActivityTimeline items={timeline} />
      </section>
    </motion.div>
  )
}
