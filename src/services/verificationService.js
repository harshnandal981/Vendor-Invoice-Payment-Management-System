import {
  addWithTimestamps,
  getAllOrdered,
  getById,
  updateWithTimestamp,
} from './firestoreUtils'
import { createRecord, ensureCollection, readCollection, updateRecord } from '../utils/browserStorage'
import { verifications as seedVerifications } from '../data/mockData'
import { db } from '../lib/firebase'

const COLLECTION = 'verifications'

ensureCollection(COLLECTION, seedVerifications)

export const createVerification = async (verification) => {
  if (db) return addWithTimestamps(COLLECTION, verification)
  const record = {
    id: `ver-${Date.now()}`,
    ...verification,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  createRecord(COLLECTION, record)
  return record.id
}

export const getVerifications = async () => {
  if (db) return getAllOrdered(COLLECTION, 'createdAt', 'desc')
  return readCollection(COLLECTION, seedVerifications)
}

export const getVerificationById = async (id) => {
  if (db) return getById(COLLECTION, id)
  return readCollection(COLLECTION, seedVerifications).find((item) => item.id === id) || null
}

export const updateVerification = async (id, data) => {
  if (db) return updateWithTimestamp(COLLECTION, id, data)
  return updateRecord(COLLECTION, id, { ...data, updatedAt: new Date().toISOString() })
}
