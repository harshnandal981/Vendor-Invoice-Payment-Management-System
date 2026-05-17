const styles = {
  received: 'bg-slate-100 text-slate-700 border-slate-200',
  'under verification': 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

export default function StatusPill({ status }) {
  const className = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm ${className}`}>
      {status}
    </span>
  )
}
