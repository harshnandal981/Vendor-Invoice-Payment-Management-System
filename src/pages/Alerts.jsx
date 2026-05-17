import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppData } from '../context/AppDataContext'
import AlertPanel from '../components/AlertPanel'

export default function Alerts() {
  const { alerts, sync } = useAppData()
  const [criticalOnly, setCriticalOnly] = useState(false)

  const filteredAlerts = useMemo(() => {
    if (!criticalOnly) return alerts
    return {
      overdueInvoices: alerts.overdueInvoices,
      missingApprovals: alerts.upcomingPayments,
      duplicateWarnings: [],
    }
  }, [alerts, criticalOnly])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Alerts</p>
        <h1 className="mt-2 font-[Poppins] text-3xl font-semibold text-slate-900">Operational alert center</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">Watch overdue invoices, missing approvals, and duplicate invoice warnings.</p>
      </div>

      <AlertPanel
        overdueInvoices={filteredAlerts.overdueInvoices}
        missingApprovals={filteredAlerts.missingApprovals}
        duplicateWarnings={filteredAlerts.duplicateWarnings}
        onRefresh={sync}
        onFilter={() => setCriticalOnly((value) => !value)}
        filterLabel={criticalOnly ? 'Show all' : 'Critical only'}
      />
    </motion.div>
  )
}
