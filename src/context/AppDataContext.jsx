/* eslint-disable react-hooks/set-state-in-effect, react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { activities as seedActivities, approvals as seedApprovals, invoices as seedInvoices, payments as seedPayments, vendors as seedVendors, verifications as seedVerifications } from '../data/mockData'
import { readCollection, writeCollection } from '../utils/browserStorage'
import { uploadInvoiceAndExtract } from '../services/invoiceUploadService'
import { createVendor, deleteVendor, getVendors, updateVendor } from '../services/vendorService'
import { deleteInvoice, getInvoices, updateInvoice } from '../services/invoiceService'
import { createApproval, getApprovals, updateApproval } from '../services/approvalService'
import { createPayment, getPayments, updatePayment } from '../services/paymentService'
import { getActivityLogs, logActivity } from '../services/activityLogService'
import { getVerifications, createVerification, updateVerification } from '../services/verificationService'
import { db, hasFirebaseConfig } from '../lib/firebase'
import { listenToOrderedCollection } from '../services/firestoreUtils'

const AppDataContext = createContext(null)

const storageKeys = {
  session: 'session',
  preferences: 'preferences',
}

const defaultPreferences = {
  emailAlerts: true,
  treasurySummary: true,
  browserSync: true,
  showConfidence: true,
}

const defaultSession = {
  isAuthenticated: false,
  role: 'founder',
  name: 'Founder',
  email: '',
}

const defaultState = {
  vendors: seedVendors,
  invoices: seedInvoices,
  approvals: seedApprovals,
  payments: seedPayments,
  activities: seedActivities,
  verifications: seedVerifications,
}

const normalizeDate = (value) => {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value?.toDate === 'function') return value.toDate().toISOString()
  return String(value)
}

const mapInvoiceForDisplay = (invoice) => ({
  ...invoice,
  createdAt: normalizeDate(invoice.createdAt),
  updatedAt: normalizeDate(invoice.updatedAt),
})

const daysUntil = (value) => {
  if (!value) return null
  const due = new Date(value)
  if (Number.isNaN(due.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - today.getTime()) / 86400000)
}

const createLocalId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`

export function AppDataProvider({ children }) {
  const [state, setState] = useState(defaultState)
  const [toasts, setToasts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isVendorEditorOpen, setIsVendorEditorOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState(null)
  const [isSavingVendor, setIsSavingVendor] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
  const [selectedPaymentId, setSelectedPaymentId] = useState(null)
  const [preferences, setPreferences] = useState(() => readCollection(storageKeys.preferences, defaultPreferences))
  const [session, setSession] = useState(() => readCollection(storageKeys.session, defaultSession))

  const persistSession = useCallback((nextSession) => {
    setSession(nextSession)
    writeCollection(storageKeys.session, nextSession)
  }, [])

  const persistPreferences = useCallback((nextPreferences) => {
    setPreferences(nextPreferences)
    writeCollection(storageKeys.preferences, nextPreferences)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((title, message, tone = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((current) => [...current, { id, title, message, tone }])
    window.setTimeout(() => dismissToast(id), 3800)
  }, [dismissToast])

  const sync = useCallback(async () => {
    setIsSyncing(true)
    try {
      const [vendors, invoices, approvals, payments, activities, verifications] = await Promise.all([
        getVendors(),
        getInvoices(),
        getApprovals(),
        getPayments(),
        getActivityLogs(),
        getVerifications(),
      ])

      setState({
        vendors: vendors.length ? vendors : seedVendors,
        invoices: (invoices.length ? invoices : seedInvoices).map(mapInvoiceForDisplay),
        approvals: approvals.length ? approvals : seedApprovals,
        payments: payments.length ? payments : seedPayments,
        activities: activities.length ? activities : seedActivities,
        verifications: verifications.length ? verifications : seedVerifications,
      })
    } finally {
      setIsSyncing(false)
    }
  }, [])

  useEffect(() => {
    sync()

    const unsubscribers = []
    if (db) {
      unsubscribers.push(
        listenToOrderedCollection('vendors', (items) => setState((current) => ({ ...current, vendors: items })), 'createdAt', 'desc'),
        listenToOrderedCollection('invoices', (items) => setState((current) => ({ ...current, invoices: items.map(mapInvoiceForDisplay) })), 'createdAt', 'desc'),
        listenToOrderedCollection('approvals', (items) => setState((current) => ({ ...current, approvals: items })), 'createdAt', 'desc'),
        listenToOrderedCollection('payments', (items) => setState((current) => ({ ...current, payments: items })), 'createdAt', 'desc'),
        listenToOrderedCollection('activity_logs', (items) => setState((current) => ({ ...current, activities: items })), 'createdAt', 'desc'),
        listenToOrderedCollection('verifications', (items) => setState((current) => ({ ...current, verifications: items })), 'createdAt', 'desc'),
      )
    }

    const handleStorage = () => sync()
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
      unsubscribers.forEach((unsubscribe) => unsubscribe?.())
    }
  }, [sync])

  const refreshAndToast = useCallback(async (action, successTitle, successMessage) => {
    try {
      const result = await action()
      await sync()
      if (successTitle) pushToast(successTitle, successMessage)
      return result
    } catch (error) {
      pushToast('Action failed', error.message || 'Please try again.', 'danger')
      throw error
    }
  }, [pushToast, sync])

  const login = useCallback(async ({ email, role }) => {
    const nextSession = {
      isAuthenticated: true,
      role,
      email,
      name: role === 'founder' ? 'Founder' : 'Operations',
    }
    persistSession(nextSession)
    pushToast('Signed in', `Welcome back, ${nextSession.name}.`)
  }, [persistSession, pushToast])

  const logout = useCallback(() => {
    persistSession(defaultSession)
    pushToast('Signed out', 'Your session has been cleared.')
  }, [persistSession, pushToast])

  const openUpload = () => setIsUploadOpen(true)
  const closeUpload = () => {
    setSelectedInvoiceId(null)
    setIsUploadOpen(false)
  }

  const openVendorEditor = (vendor = null) => {
    setEditingVendor(vendor)
    setIsVendorEditorOpen(true)
  }

  const closeVendorEditor = () => {
    setEditingVendor(null)
    setIsVendorEditorOpen(false)
  }

  const saveVendor = async (vendor) => {
    setIsSavingVendor(true)
    try {
      await refreshAndToast(async () => {
        if (vendor.id) {
          await updateVendor(vendor.id, vendor)
          await logActivity({ title: `Vendor updated: ${vendor.name}`, meta: vendor.email })
        } else {
          await createVendor(vendor)
          await logActivity({ title: `Vendor added: ${vendor.name}`, meta: vendor.email })
        }
      }, vendor.id ? 'Vendor updated' : 'Vendor added', `${vendor.name} saved successfully.`)
      closeVendorEditor()
    } finally {
      setIsSavingVendor(false)
    }
  }

  const removeVendorById = async (vendorId) => refreshAndToast(async () => {
    const target = state.vendors.find((vendor) => vendor.id === vendorId)
    await deleteVendor(vendorId)
    await logActivity({ title: `Vendor removed: ${target?.name || vendorId}`, meta: 'Vendor directory' })
  }, 'Vendor removed', 'Vendor profile deleted.')

  const saveInvoice = async ({ file, extractionOverrides = {}, uploadedBy = session.name }) => {
    setIsUploading(true)
    try {
      const result = await uploadInvoiceAndExtract({
        file,
        uploadedBy,
        extractionOverrides,
        existingInvoices: state.invoices,
      })

      const verificationId = await createVerification({
        invoiceId: result.invoiceId,
        invoiceNumber: result.number,
        vendor: result.vendor,
        status: 'pending',
        checklist: [
          { id: createLocalId('task'), label: 'Work scope confirmed', done: false },
          { id: createLocalId('task'), label: 'Deliverables uploaded', done: false },
          { id: createLocalId('task'), label: 'Proof of completion attached', done: false },
        ],
        notes: '',
        proof: '',
      })

      await createApproval({
        invoiceId: result.invoiceId,
        invoiceNumber: result.number,
        vendor: result.vendor,
        amount: result.amount,
        dueDate: result.dueDate,
        verificationId,
        status: 'pending',
        comments: '',
      })

      await sync()
      pushToast('Invoice uploaded', `${result.number} captured for ${result.vendor}.`)
      return result
    } catch (error) {
      pushToast('Upload failed', error.message || 'Unable to store the invoice.', 'danger')
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const saveInvoiceEdits = async (invoiceId, changes) => refreshAndToast(async () => {
    await updateInvoice(invoiceId, changes)
    const approval = state.approvals.find((item) => item.invoiceId === invoiceId)
    if (approval) {
      await updateApproval(approval.id, {
        vendor: changes.vendor || approval.vendor,
        invoiceNumber: changes.number || approval.invoiceNumber,
        amount: changes.amount ?? approval.amount,
        dueDate: changes.dueDate || approval.dueDate,
      })
    }
    const verification = state.verifications.find((item) => item.invoiceId === invoiceId)
    if (verification) {
      await updateVerification(verification.id, {
        vendor: changes.vendor || verification.vendor,
        invoiceNumber: changes.number || verification.invoiceNumber,
      })
    }
    await logActivity({ title: `Invoice updated: ${changes.number || invoiceId}`, meta: changes.vendor || 'Invoice register' })
  }, 'Invoice updated', 'Invoice details saved.')

  const removeInvoiceById = async (invoiceId) => refreshAndToast(async () => {
    const target = state.invoices.find((invoice) => invoice.id === invoiceId)
    await deleteInvoice(invoiceId)
    await logActivity({ title: `Invoice deleted: ${target?.number || invoiceId}`, meta: target?.vendor || 'Invoice register' })
  }, 'Invoice deleted', 'Invoice and related workflow items were removed.')

  const changeInvoiceStatus = async (invoiceId, status) => refreshAndToast(async () => {
    const invoice = state.invoices.find((item) => item.id === invoiceId)
    await updateInvoice(invoiceId, { status })

    const approval = state.approvals.find((item) => item.invoiceId === invoiceId)
    const verification = state.verifications.find((item) => item.invoiceId === invoiceId)
    const payment = state.payments.find((item) => item.invoiceId === invoiceId)

    if (status === 'under verification' && verification) {
      await updateVerification(verification.id, { status: 'in review' })
    }

    if (status === 'approved' && approval) {
      await updateApproval(approval.id, { status: 'approved' })
      if (!payment) {
        await createPayment({
          invoiceId,
          invoiceNumber: invoice?.number,
          vendor: invoice?.vendor,
          amount: invoice?.amount,
          method: 'ACH',
          status: 'scheduled',
          date: invoice?.dueDate,
          transactionReference: '',
        })
      }
    }

    if (status === 'paid' && payment) {
      await updatePayment(payment.id, { status: 'paid', paymentDate: new Date().toISOString().slice(0, 10) })
    }

    await logActivity({ title: `Invoice ${invoice?.number || invoiceId} marked ${status}`, meta: invoice?.vendor || 'Invoice workflow' })
  }, 'Invoice updated', `Status changed to ${status}.`)

  const updateVerificationRecord = async (verificationId, changes) => refreshAndToast(async () => {
    const verification = state.verifications.find((item) => item.id === verificationId)
    await updateVerification(verificationId, changes)
    if (changes.status === 'completed' && verification?.invoiceId) {
      await updateInvoice(verification.invoiceId, { status: 'approved' })
    }
    await logActivity({ title: `Verification updated: ${verification?.invoiceNumber || verificationId}`, meta: changes.status || 'Verification queue' })
  }, 'Verification saved', 'Verification progress updated.')

  const changeApprovalStatus = async (approvalId, status, comments = '') => refreshAndToast(async () => {
    const target = state.approvals.find((approval) => approval.id === approvalId)
    await updateApproval(approvalId, { status, comments })
    if (target?.invoiceId) {
      await updateInvoice(target.invoiceId, { status: status === 'approved' ? 'approved' : 'received' })
    }
    if (status === 'approved' && target) {
      const existingPayment = state.payments.find((payment) => payment.invoiceId === target.invoiceId)
      if (!existingPayment) {
        await createPayment({
          vendor: target.vendor,
          invoiceNumber: target.invoiceNumber,
          invoiceId: target.invoiceId,
          amount: target.amount,
          method: 'ACH',
          status: 'scheduled',
          date: target.dueDate,
          transactionReference: '',
        })
      }
    }
    await logActivity({ title: `Approval ${status}: ${target?.invoiceNumber || approvalId}`, meta: target?.vendor || 'Approval queue' })
  }, 'Approval updated', `Marked ${status}.`)

  const updatePaymentRecord = async (paymentId, changes) => refreshAndToast(async () => {
    const payment = state.payments.find((item) => item.id === paymentId)
    await updatePayment(paymentId, changes)
    if (changes.status === 'paid' && payment?.invoiceId) {
      await updateInvoice(payment.invoiceId, { status: 'paid' })
    }
    await logActivity({ title: `Payment updated: ${payment?.invoiceNumber || paymentId}`, meta: changes.status || payment?.vendor || 'Payments' })
  }, 'Payment updated', 'Treasury record saved.')

  const markPaymentPaid = async (paymentId) => updatePaymentRecord(paymentId, {
    status: 'paid',
    paymentDate: new Date().toISOString().slice(0, 10),
    transactionReference: `TXN-${Date.now()}`,
  })

  const setPreference = useCallback((key, value) => {
    const next = { ...preferences, [key]: value }
    persistPreferences(next)
  }, [persistPreferences, preferences])

  const selectedInvoice = useMemo(() => state.invoices.find((invoice) => invoice.id === selectedInvoiceId) || null, [selectedInvoiceId, state.invoices])
  const selectedPayment = useMemo(() => state.payments.find((payment) => payment.id === selectedPaymentId) || null, [selectedPaymentId, state.payments])

  const summary = useMemo(() => {
    const pendingApprovals = state.approvals.filter((approval) => approval.status === 'pending').length
    const pendingPayments = state.payments.filter((payment) => ['scheduled', 'pending'].includes(payment.status)).length
    const overdueInvoices = state.invoices.filter((invoice) => invoice.status === 'overdue' || (invoice.status !== 'paid' && (daysUntil(invoice.dueDate) ?? 0) < 0)).length
    const totalInvoiceAmount = state.invoices.reduce((total, invoice) => total + Number(invoice.amount || 0), 0)
    const paidThisMonth = state.payments
      .filter((payment) => payment.status === 'paid')
      .reduce((total, payment) => total + Number(payment.amount || 0), 0)

    return {
      totalVendors: state.vendors.length,
      pendingApprovals,
      pendingPayments,
      paidThisMonth,
      overdueInvoices,
      totalInvoiceAmount,
    }
  }, [state])

  const alerts = useMemo(() => {
    const overdueInvoices = state.invoices
      .filter((invoice) => invoice.status === 'overdue' || (invoice.status !== 'paid' && (daysUntil(invoice.dueDate) ?? 0) < 0))
      .map((invoice) => ({
        id: invoice.id,
        title: `${invoice.number} is overdue`,
        detail: `${invoice.vendor} is past due. Escalate follow-up and confirm payment release.`,
        tone: 'critical',
      }))

    const missingVerifications = state.verifications
      .filter((verification) => verification.status !== 'completed')
      .map((verification) => ({
        id: verification.id,
        title: `${verification.invoiceNumber} needs verification`,
        detail: `${verification.vendor} still requires work confirmation.`,
        tone: 'warning',
      }))

    const duplicates = state.invoices.filter((invoice, index, invoices) => invoices.findIndex((entry) => entry.number === invoice.number && entry.vendor === invoice.vendor) !== index)
      .map((invoice) => ({
        id: invoice.id,
        title: `Duplicate invoice ${invoice.number}`,
        detail: `${invoice.vendor} already has this invoice number on file.`,
        tone: 'warning',
      }))

    const upcomingPayments = state.invoices
      .filter((invoice) => invoice.status !== 'paid')
      .filter((invoice) => {
        const diff = daysUntil(invoice.dueDate)
        return diff !== null && diff >= 0 && diff <= 7
      })
      .map((invoice) => ({
        id: `due-${invoice.id}`,
        title: `${invoice.number} due soon`,
        detail: `${invoice.vendor} is due on ${invoice.dueDate}.`,
        tone: 'warning',
      }))

    return {
      overdueInvoices,
      missingApprovals: missingVerifications,
      duplicateWarnings: duplicates,
      upcomingPayments,
    }
  }, [state])

  const timeline = useMemo(() => [...state.activities].slice(0, 8), [state.activities])

  const notifications = useMemo(() => [
    ...alerts.overdueInvoices,
    ...alerts.missingApprovals,
    ...alerts.duplicateWarnings,
    ...alerts.upcomingPayments,
  ].slice(0, 6), [alerts])

  const value = {
    ...state,
    hasFirebaseConfig,
    session,
    preferences,
    isSyncing,
    isUploading,
    isSavingVendor,
    isUploadOpen,
    isVendorEditorOpen,
    editingVendor,
    searchQuery,
    toasts,
    summary,
    alerts,
    timeline,
    notifications,
    selectedInvoice,
    selectedPayment,
    setSearchQuery,
    pushToast,
    dismissToast,
    sync,
    login,
    logout,
    openUpload,
    closeUpload,
    saveInvoice,
    saveInvoiceEdits,
    removeInvoiceById,
    openVendorEditor,
    closeVendorEditor,
    saveVendor,
    removeVendorById,
    changeInvoiceStatus,
    updateVerificationRecord,
    changeApprovalStatus,
    updatePaymentRecord,
    markPaymentPaid,
    setPreference,
    setSelectedInvoiceId,
    setSelectedPaymentId,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export const useAppData = () => {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider')
  }
  return context
}
