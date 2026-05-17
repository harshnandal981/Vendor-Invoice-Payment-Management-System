import { motion } from 'framer-motion'
import { useAppData } from '../context/AppDataContext'

export default function Verifications() {
  const { verifications, updateVerificationRecord } = useAppData()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Verifications</p>
        <h1 className="mt-2 font-[Poppins] text-3xl font-semibold text-slate-900">Work verification queue</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">Operations confirms work completion before invoices move to approval.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {verifications.map((verification) => {
          const completedCount = verification.checklist?.filter((item) => item.done).length || 0
          const totalCount = verification.checklist?.length || 0
          return (
            <section key={verification.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{verification.vendor}</p>
                  <h2 className="mt-2 font-[Poppins] text-xl font-semibold text-slate-900">{verification.invoiceNumber}</h2>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {verification.status}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {verification.checklist?.map((item) => (
                  <label key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                    <span className="text-sm text-slate-700">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={(event) => {
                        const nextChecklist = verification.checklist.map((entry) => entry.id === item.id ? { ...entry, done: event.target.checked } : entry)
                        const nextStatus = nextChecklist.every((entry) => entry.done) ? 'completed' : 'in review'
                        updateVerificationRecord(verification.id, { checklist: nextChecklist, status: nextStatus })
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <textarea
                  value={verification.notes || ''}
                  onChange={(event) => updateVerificationRecord(verification.id, { notes: event.target.value })}
                  rows={4}
                  placeholder="Verification notes"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]"
                />
                <textarea
                  value={verification.proof || ''}
                  onChange={(event) => updateVerificationRecord(verification.id, { proof: event.target.value })}
                  rows={4}
                  placeholder="Proof links or deliverables"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]"
                />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                <span>{completedCount}/{totalCount} tasks complete</span>
                <button
                  onClick={() => updateVerificationRecord(verification.id, { status: completedCount === totalCount ? 'completed' : 'in review' })}
                  className="rounded-2xl bg-[#0f1115] px-4 py-2 text-xs font-semibold text-white"
                >
                  Save verification
                </button>
              </div>
            </section>
          )
        })}
      </div>
    </motion.div>
  )
}
