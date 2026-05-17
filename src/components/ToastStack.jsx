import { CheckCircle2, AlertCircle, XCircle, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const toneConfig = {
  success: { icon: CheckCircle2, ring: 'border-emerald-200', accent: 'text-emerald-700' },
  warning: { icon: AlertCircle, ring: 'border-amber-200', accent: 'text-amber-700' },
  danger: { icon: XCircle, ring: 'border-rose-200', accent: 'text-rose-700' },
}

export default function ToastStack({ toasts = [], onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[92vw] max-w-sm flex-col gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = toneConfig[toast.tone] || toneConfig.success
          const Icon = config.icon

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className={`rounded-2xl border bg-white/95 p-4 shadow-[0_18px_50px_rgba(15,17,21,0.18)] backdrop-blur ${config.ring}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full bg-slate-900/5 p-2 ${config.accent}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{toast.message}</p>
                </div>
                <button onClick={() => onDismiss(toast.id)} className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900">
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
