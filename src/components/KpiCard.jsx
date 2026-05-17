import { motion } from 'framer-motion'

const cardStyles = {
  gold: 'from-[#fff8e7] to-white border-[#e9d28a]',
  dark: 'from-[#111319] to-[#171a20] border-[#20242d] text-white',
  amber: 'from-[#fff6df] to-white border-[#f0d98c]',
  rose: 'from-[#fff1ef] to-white border-[#efb8ab]',
}

const textStyles = {
  gold: {
    label: 'text-slate-500',
    value: 'text-slate-900',
    delta: 'text-slate-500',
    icon: 'bg-[#0f1115] text-white',
  },
  dark: {
    label: 'text-white/55',
    value: 'text-white',
    delta: 'text-white/70',
    icon: 'bg-white/8 text-white',
  },
  amber: {
    label: 'text-slate-500',
    value: 'text-slate-900',
    delta: 'text-slate-500',
    icon: 'bg-[#0f1115] text-white',
  },
  rose: {
    label: 'text-slate-500',
    value: 'text-slate-900',
    delta: 'text-slate-500',
    icon: 'bg-[#0f1115] text-white',
  },
}

export default function KpiCard({ title, value, delta, icon: Icon, tone = 'gold' }) {
  const palette = textStyles[tone] || textStyles.gold

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`min-w-0 rounded-[28px] border bg-gradient-to-br p-4 shadow-[0_18px_55px_rgba(15,17,21,0.07)] sm:p-5 ${cardStyles[tone] || cardStyles.gold}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-[10px] uppercase tracking-[0.2em] ${palette.label}`}>{title}</p>
          <p className={`mt-2 font-[Poppins] text-[21px] font-semibold tracking-tight sm:text-[23px] ${palette.value}`}>{value}</p>
        </div>
        {Icon ? (
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-[0_10px_25px_rgba(15,17,21,0.18)] ${palette.icon}`}>
            <Icon size={16} />
          </div>
        ) : null}
      </div>
      <p className={`mt-2.5 text-[12px] ${palette.delta}`}>{delta}</p>
    </motion.div>
  )
}
