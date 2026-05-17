import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, Menu, Search, Upload } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export default function TopNav({ onMenu, onUpload, searchQuery, setSearchQuery }) {
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { notifications, session, logout } = useAppData()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setAlertsOpen(false)
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-3 py-3 sm:px-5 lg:px-6">
        <button
          onClick={onMenu}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="relative max-w-xl xl:max-w-2xl">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search vendors, invoices, payments..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/90 pl-10 pr-4 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/12"
            />
          </div>
        </div>

        <div ref={dropdownRef} className="relative flex shrink-0 items-center gap-2 sm:gap-2.5">
          <button
            onClick={onUpload}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#0f1115] px-3.5 text-[13px] font-semibold text-white shadow-[0_16px_30px_rgba(15,17,21,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Upload Invoice</span>
          </button>

          <button
            onClick={() => {
              setProfileOpen(false)
              setAlertsOpen((value) => !value)
            }}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {notifications.length ? <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#D4AF37]" /> : null}
          </button>

          <button
            onClick={() => {
              setAlertsOpen(false)
              setProfileOpen((value) => !value)
            }}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 pr-3 text-[13px] font-medium text-slate-900 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f1115] text-xs font-bold text-white">{session.role === 'founder' ? 'FX' : 'OP'}</span>
            <span className="hidden md:block">{session.name}</span>
            <ChevronDown size={16} className="text-slate-500" />
          </button>

          <AnimatePresence>
            {alertsOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-16 w-[320px] rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,17,21,0.16)]"
              >
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {notifications.length ? notifications.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                    </div>
                  )) : (
                    <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">No live alerts right now.</div>
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {profileOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-16 w-[260px] rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,17,21,0.16)]"
              >
                <p className="text-sm font-semibold text-slate-900">{session.name}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <Link to="/settings" className="block w-full rounded-2xl bg-slate-50 px-3 py-2 text-left transition hover:bg-slate-100">Account settings</Link>
                  <Link to="/payments" className="block w-full rounded-2xl bg-slate-50 px-3 py-2 text-left transition hover:bg-slate-100">Treasury preferences</Link>
                  <button onClick={logout} className="w-full rounded-2xl bg-slate-50 px-3 py-2 text-left transition hover:bg-slate-100">Sign out</button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
