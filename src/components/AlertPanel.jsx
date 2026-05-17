import { AlertTriangle, Filter, RefreshCw } from 'lucide-react'

const toneClasses = {
  critical: 'border-rose-200 bg-rose-50 text-rose-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
}

export default function AlertPanel({ overdueInvoices = [], missingApprovals = [], duplicateWarnings = [], onRefresh, onFilter, filterLabel = 'Filter' }) {
  const sections = [
    { title: 'Overdue invoices', items: overdueInvoices },
    { title: 'Missing approvals', items: missingApprovals },
    { title: 'Duplicate warnings', items: duplicateWarnings },
  ]

  return (
    <div className="min-w-0 rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div>
          <p className="text-sm font-semibold text-slate-900">Alerts</p>
          <p className="text-xs text-slate-500">Operational exceptions and follow-ups</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={onRefresh} className="inline-flex h-9 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50">
            <RefreshCw size={15} />
            Refresh
          </button>
          <button onClick={onFilter} className="inline-flex h-9 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50">
            <Filter size={15} />
            {filterLabel}
          </button>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle size={15} className="text-[#D4AF37]" />
              <p className="text-sm font-semibold text-slate-900">{section.title}</p>
            </div>
            <div className="space-y-3">
              {section.items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                  No items in this section.
                </div>
              ) : (
                section.items.map((item) => (
                  <div key={item.id} className={`rounded-2xl border p-4 text-sm transition hover:-translate-y-0.5 hover:shadow-sm ${toneClasses[item.tone] || toneClasses.warning}`}>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 opacity-80">{item.detail}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
