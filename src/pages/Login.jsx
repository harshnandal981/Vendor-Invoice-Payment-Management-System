import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'

export default function Login() {
  const { session, login } = useAppData()
  const [form, setForm] = useState({ email: 'founder@vendorpay.app', role: 'founder' })

  if (session.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f3ec] px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_28px_70px_rgba(15,17,21,0.1)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f1115] text-[#D4AF37]">
          <ShieldCheck size={24} />
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-slate-400">VendorPay Ops</p>
        <h1 className="mt-3 font-[Poppins] text-3xl font-semibold text-slate-900">Sign in to the command center</h1>
        <p className="mt-3 text-sm text-slate-500">Choose a role to test real workflows, permissions, and operational actions.</p>

        <div className="mt-8 space-y-4">
          <label className="grid gap-2 text-sm text-slate-600">
            Email
            <input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Role
            <select
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-[#D4AF37]"
            >
              <option value="founder">Founder / Admin</option>
              <option value="operations">Operations Team</option>
            </select>
          </label>
        </div>

        <button
          onClick={() => login(form)}
          className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#0f1115] text-sm font-semibold text-white transition hover:bg-black"
        >
          Continue
        </button>
      </motion.div>
    </div>
  )
}
