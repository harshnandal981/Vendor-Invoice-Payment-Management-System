import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function AnalyticsPanel({ trendData = [], paymentData = [] }) {
  return (
    <div className="grid min-w-0 gap-6 2xl:grid-cols-2">
      <div className="min-w-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Invoice trend</p>
            <p className="text-xs text-slate-500">Invoices created over the past 7 days</p>
          </div>
          <span className="rounded-full border border-[#D4AF37]/20 bg-[#fff9e7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a641c]">
            Live
          </span>
        </div>
        <div className="mt-5 h-72 min-w-0 rounded-[24px] bg-gradient-to-b from-slate-50 to-white p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#ece7db" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="count" stroke="#0f1115" strokeWidth={2.5} fill="url(#trendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Payment completion</p>
            <p className="text-xs text-slate-500">Status split across treasury operations</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Treasury
          </span>
        </div>
        <div className="mt-5 h-72 min-w-0 rounded-[24px] bg-gradient-to-b from-slate-50 to-white p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ece7db" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#D4AF37" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
