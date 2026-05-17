import { motion } from 'framer-motion'
import { Clock3, UserRoundCheck, FileUp, BadgeCheck } from 'lucide-react'

const iconMap = [FileUp, UserRoundCheck, BadgeCheck, Clock3]

export default function ActivityTimeline({ items = [] }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] font-semibold text-slate-900">Activity timeline</p>
          <p className="text-xs text-slate-500">Recent operational events</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
            No recent activity.
          </div>
        ) : (
          items.map((item, index) => {
            const Icon = iconMap[index % iconMap.length]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-[#D4AF37]/40 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Icon size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-slate-900">{item.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{item.meta}</p>
                </div>
                <p className="text-[9px] uppercase tracking-[0.14em] text-slate-400">{item.time}</p>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
