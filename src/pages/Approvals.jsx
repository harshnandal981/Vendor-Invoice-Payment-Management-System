import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import ApprovalQueue from '../components/ApprovalQueue'
import PaymentTable from '../components/PaymentTable'
import { useAppData } from '../context/AppDataContext'

export default function Approvals() {
  const { approvals, payments, isSyncing, changeApprovalStatus, markPaymentPaid, sync, pushToast } = useAppData()
  const [error, setError] = useState('')

  const pendingApprovals = useMemo(
    () => approvals.filter((approval) => approval.status === 'pending'),
    [approvals]
  )

  const handleApprove = async (approval) => {
    try {
      await changeApprovalStatus(approval.id, 'approved')
    } catch {
      setError('Approval update failed. Check Firestore permissions.')
    }
  }

  const handleReject = async (approval) => {
    try {
      await changeApprovalStatus(approval.id, 'rejected')
    } catch {
      setError('Rejection update failed. Check Firestore permissions.')
    }
  }

  const handleMarkPaid = async (payment) => {
    try {
      await markPaymentPaid(payment.id)
    } catch {
      setError('Payment update failed. Check Firestore permissions.')
    }
  }

  const handleRefreshTreasury = async () => {
    try {
      await sync()
      pushToast('Treasury refreshed', 'Payment and approval data reloaded.')
    } catch {
      setError('Unable to refresh treasury data right now.')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Approvals
          </p>
          <h2 className="mt-2 font-[Poppins] text-2xl font-semibold text-slate-900">
            Approval workflow and payments
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Validate work completion, approve invoices, and track payouts in one view.
          </p>
        </div>
        <button onClick={handleRefreshTreasury} className="rounded-2xl bg-[#0f1115] px-4 py-3 text-xs font-semibold text-white shadow-[0_16px_30px_rgba(15,17,21,0.15)] transition hover:-translate-y-0.5 hover:bg-black">
          Refresh treasury
        </button>
      </div>

      {error ? <p className="text-xs text-amber-700">{error}</p> : null}

      <ApprovalQueue
        approvals={pendingApprovals}
        onApprove={handleApprove}
        onReject={handleReject}
        isLoading={isSyncing && pendingApprovals.length === 0}
      />

      <PaymentTable
        payments={payments}
        onMarkPaid={handleMarkPaid}
        isLoading={isSyncing && payments.length === 0}
      />
    </motion.div>
  )
}
