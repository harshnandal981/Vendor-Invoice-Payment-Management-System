import {
  addWithTimestamps,
  deleteById,
  getAllOrdered,
  getById,
  updateWithTimestamp,
} from './firestoreUtils'
import { createRecord, readCollection, removeRecord, updateRecord, ensureCollection } from '../utils/browserStorage'
import { vendors as seedVendors } from '../data/mockData'
import { db } from '../lib/firebase'

const COLLECTION = 'vendors'

ensureCollection(COLLECTION, seedVendors)

export const createVendor = async (vendor) => {
  if (db) return addWithTimestamps(COLLECTION, vendor)
  const record = {
    id: `ven-${Date.now()}`,
    ...vendor,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return createRecord(COLLECTION, record).id
}

export const getVendors = async () => {
  if (db) return getAllOrdered(COLLECTION, 'createdAt', 'desc')
  return readCollection(COLLECTION, seedVendors)
}

export const getVendorById = async (id) => {
  if (db) return getById(COLLECTION, id)
  return readCollection(COLLECTION, seedVendors).find((item) => item.id === id) || null
}

export const updateVendor = async (id, data) => {
  if (db) return updateWithTimestamp(COLLECTION, id, data)
  return updateRecord(COLLECTION, id, { ...data, updatedAt: new Date().toISOString() })
}

export const deleteVendor = async (id) => {
  if (db) return deleteById(COLLECTION, id)
  return removeRecord(COLLECTION, id)
}
