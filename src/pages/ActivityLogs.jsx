import { motion } from 'framer-motion'
import { useAppData } from '../context/AppDataContext'

export default function ActivityLogs() {
  const { activities } = useAppData()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Activity Logs</p>
        <h1 className="mt-2 font-[Poppins] text-3xl font-semibold text-slate-900">Audit trail</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">Every upload, verification, approval, and payment update is logged here.</p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
        {activities.map((activity, index) => (
          <div key={activity.id || index} className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-slate-900">{activity.title}</p>
              <p className="mt-1 text-sm text-slate-500">{activity.meta}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{activity.time || activity.createdAt || 'Just now'}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
