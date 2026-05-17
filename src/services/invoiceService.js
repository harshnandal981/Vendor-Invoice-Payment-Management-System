import {
  addWithTimestamps,
  deleteById,
  getAllOrdered,
  getById,
  updateWithTimestamp,
} from './firestoreUtils'
import { createRecord, ensureCollection, readCollection, removeRecord, updateRecord } from '../utils/browserStorage'
import { invoices as seedInvoices } from '../data/mockData'
import { db } from '../lib/firebase'

const COLLECTION = 'invoices'

ensureCollection(COLLECTION, seedInvoices)

export const createInvoice = async (invoice) => {
  if (db) return addWithTimestamps(COLLECTION, invoice)
  const record = {
    id: `inv-${Date.now()}`,
    ...invoice,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  createRecord(COLLECTION, record)
  return record.id
}

export const getInvoices = async () => {
  if (db) return getAllOrdered(COLLECTION, 'createdAt', 'desc')
  return readCollection(COLLECTION, seedInvoices)
}

export const getInvoiceById = async (id) => {
  if (db) return getById(COLLECTION, id)
  return readCollection(COLLECTION, seedInvoices).find((item) => item.id === id) || null
}

export const updateInvoice = async (id, data) => {
  if (db) return updateWithTimestamp(COLLECTION, id, data)
  return updateRecord(COLLECTION, id, { ...data, updatedAt: new Date().toISOString() })
}

export const updateInvoiceStatus = async (id, status) => {
  if (db) return updateWithTimestamp(COLLECTION, id, { status })
  return updateRecord(COLLECTION, id, { status, updatedAt: new Date().toISOString() })
}

export const deleteInvoice = async (id) => {
  if (db) return deleteById(COLLECTION, id)
  return removeRecord(COLLECTION, id)
}
