export default function ActivityFeed({ activities = [] }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.07)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Activity timeline</p>
          <p className="text-xs text-slate-500">Recent operational events</p>
        </div>
        <button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#D4AF37] hover:text-slate-900">
          View log
        </button>
      </div>
      <div className="mt-5 space-y-4">
        {activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            No activity logged yet.
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-[#D4AF37]/35 hover:bg-[#fffdf8]"
            >
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_0_6px_rgba(212,175,55,0.12)]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                <p className="mt-1 text-sm text-slate-500">{activity.meta}</p>
              </div>
              <p className="whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-slate-400">
                {activity.time}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
