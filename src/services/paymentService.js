import {
  addWithTimestamps,
  deleteById,
  getAllOrdered,
  getById,
  updateWithTimestamp,
} from './firestoreUtils'
import { payments as seedPayments } from '../data/mockData'
import { createRecord, ensureCollection, readCollection, removeRecord, updateRecord } from '../utils/browserStorage'
import { db } from '../lib/firebase'

const COLLECTION = 'payments'

ensureCollection(COLLECTION, seedPayments)

export const createPayment = async (payment) => {
  if (db) return addWithTimestamps(COLLECTION, payment)
  const record = {
    id: `pay-${Date.now()}`,
    ...payment,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  createRecord(COLLECTION, record)
  return record.id
}

export const getPayments = async () => {
  if (db) return getAllOrdered(COLLECTION, 'createdAt', 'desc')
  return readCollection(COLLECTION, seedPayments)
}

export const getPaymentById = async (id) => {
  if (db) return getById(COLLECTION, id)
  return readCollection(COLLECTION, seedPayments).find((item) => item.id === id) || null
}

export const updatePayment = async (id, data) => {
  if (db) return updateWithTimestamp(COLLECTION, id, data)
  return updateRecord(COLLECTION, id, { ...data, updatedAt: new Date().toISOString() })
}

export const deletePayment = async (id) => {
  if (db) return deleteById(COLLECTION, id)
  return removeRecord(COLLECTION, id)
}
