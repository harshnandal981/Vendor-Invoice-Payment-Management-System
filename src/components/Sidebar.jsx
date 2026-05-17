import { AnimatePresence, motion } from 'framer-motion'
import { Activity, AlertTriangle, Banknote, BellRing, ChevronLeft, ChevronRight, CreditCard, FileText, LayoutDashboard, Settings2, ShieldCheck, Users, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vendors', label: 'Vendors', icon: Users },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/verifications', label: 'Verifications', icon: ShieldCheck },
  { to: '/approvals', label: 'Approvals', icon: ShieldCheck },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/activity-logs', label: 'Activity Logs', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings2 },
]

const navSummary = [
  { label: 'Outstanding', value: '$84.2k', icon: Banknote },
  { label: 'Alerts', value: '7 live', icon: BellRing },
]

export default function Sidebar({ collapsed, mobileOpen, onClose, onToggleCollapse }) {
  const sidebarWidth = collapsed ? 'lg:w-[84px]' : 'lg:w-[256px]'

  const content = (
    <div className="flex h-full flex-col overflow-y-auto bg-[#0f1115] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37] text-sm font-black text-[#0f1115] shadow-[0_18px_45px_rgba(212,175,55,0.24)]">
            Vx
          </div>
          <AnimatePresence initial={false}>
            {!collapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="min-w-0"
              >
                <p className="font-[Poppins] text-sm font-semibold tracking-[0.24em] text-white/60">
                  VENDORPAY
                </p>
                <p className="text-sm text-white/85">Founder Operations</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <button
          onClick={onToggleCollapse}
          className="hidden rounded-full border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:inline-flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <button
          onClick={onClose}
          className="inline-flex rounded-full border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 px-3 py-4">
        <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">This month</p>
          <p className="mt-2 text-2xl font-semibold text-[#D4AF37]">$248,120</p>
          <p className="mt-1 text-xs text-white/60">Scheduled payouts</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white text-[#0f1115] shadow-[0_10px_28px_rgba(255,255,255,0.08)]'
                      : 'text-white/72 hover:bg-white/7 hover:text-white',
                  ].join(' ')
                }
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 transition group-hover:bg-[#D4AF37]/15">
                  <Icon size={18} />
                </span>
                <AnimatePresence initial={false}>
                  {!collapsed ? (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                    >
                      {item.label}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </NavLink>
            )
          })}
        </nav>

        {!collapsed ? (
          <div className="mt-6 grid gap-3">
            {navSummary.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>{item.label}</span>
                    <Icon size={15} />
                  </div>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">Risk signal</p>
          <p className="mt-2 text-sm font-semibold text-white">3 invoices require attention</p>
          <p className="mt-1 text-xs text-white/60">Overdue and duplicate checks run daily.</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 hidden overflow-hidden border-r border-white/10 shadow-[18px_0_50px_rgba(0,0,0,0.18)] transition-all duration-300 lg:block ${sidebarWidth}`}>
        {content}
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/55 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed inset-y-0 left-0 z-50 w-[292px] overflow-hidden border-r border-white/10 shadow-[18px_0_50px_rgba(0,0,0,0.18)] lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
