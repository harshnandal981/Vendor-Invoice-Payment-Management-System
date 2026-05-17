import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import VendorCard from '../components/VendorCard'
import { useAppData } from '../context/AppDataContext'

export default function Vendors() {
  const navigate = useNavigate()
  const { vendors, isSyncing, openVendorEditor, searchQuery } = useAppData()

  const filteredVendors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return vendors
    return vendors.filter((vendor) => [vendor.name, vendor.company, vendor.category, vendor.contact, vendor.email, vendor.risk].join(' ').toLowerCase().includes(q))
  }, [searchQuery, vendors])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Vendors</p>
          <h2 className="mt-2 font-[Poppins] text-2xl font-semibold text-slate-900">
            Vendor management
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Maintain verified vendors, contracts, and payment health.
          </p>
        </div>
        <button onClick={() => openVendorEditor(null)} className="rounded-2xl bg-[#0f1115] px-4 py-3 text-xs font-semibold text-white shadow-[0_16px_30px_rgba(15,17,21,0.15)] transition hover:-translate-y-0.5 hover:bg-black">
          Add vendor
        </button>
      </div>
      {isSyncing ? (
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Loading vendors...
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredVendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} onViewProfile={() => navigate(`/vendors/${vendor.id}`)} />
        ))}
      </div>

    </motion.div>
  )
}
