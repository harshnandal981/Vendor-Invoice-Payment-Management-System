import { motion } from 'framer-motion'
import { useAppData } from '../context/AppDataContext'

export default function Settings() {
  const { preferences, setPreference, hasFirebaseConfig, session } = useAppData()
  const options = [
    { key: 'emailAlerts', label: 'Email alerts for overdue invoices' },
    { key: 'treasurySummary', label: 'Daily treasury summary' },
    { key: 'browserSync', label: 'Auto-sync local fallback data' },
    { key: 'showConfidence', label: 'Show AI extraction confidence' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Settings</p>
        <h1 className="mt-2 font-[Poppins] text-3xl font-semibold text-slate-900">Workspace preferences</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">A light settings surface for alerting, sync, and operational preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
          <p className="text-sm font-semibold text-slate-900">Notifications</p>
          <div className="mt-5 space-y-3">
            {options.map((item) => (
              <label key={item.key} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <span className="text-sm text-slate-700">{item.label}</span>
                <input
                  type="checkbox"
                  checked={Boolean(preferences[item.key])}
                  onChange={(event) => setPreference(item.key, event.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
          <p className="text-sm font-semibold text-slate-900">Integration status</p>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">Role session: {session.role === 'founder' ? 'Founder / Admin' : 'Operations Team'}.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Firebase mode: {hasFirebaseConfig ? 'Live project connected.' : 'Local fallback mode active.'}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Gemini parsing: ready when `VITE_GEMINI_API_KEY` is available.</div>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
