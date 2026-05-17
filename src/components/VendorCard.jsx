const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const riskStyles = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function VendorCard({ vendor, onViewProfile }) {
  return (
    <div className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.07)] transition duration-200 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-[0_24px_65px_rgba(15,17,21,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-[Poppins] text-[14px] font-semibold text-slate-900">{vendor.name}</p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-slate-400">{vendor.category}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${riskStyles[vendor.risk]}`}>
          {vendor.risk} risk
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-[12px] text-slate-600">
        <p className="truncate">Contact: {vendor.contact}</p>
        <p className="truncate">Email: {vendor.email}</p>
        <p className="truncate">Phone: {vendor.phone}</p>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-slate-400">Outstanding</p>
          <p className="mt-2 text-[16px] font-semibold text-slate-900">
            {currency.format(Number(vendor.outstanding || 0))}
          </p>
        </div>
        <button onClick={() => onViewProfile?.(vendor)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 transition hover:border-[#D4AF37] hover:text-slate-900">
          View profile
        </button>
      </div>
    </div>
  )
}
