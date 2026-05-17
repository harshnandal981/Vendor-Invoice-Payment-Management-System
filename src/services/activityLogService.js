import {
  addWithTimestamps,
  getAllOrdered,
} from './firestoreUtils'
import { activities as seedActivities } from '../data/mockData'
import { createRecord, ensureCollection, readCollection } from '../utils/browserStorage'
import { db } from '../lib/firebase'

const COLLECTION = 'activity_logs'

ensureCollection(COLLECTION, seedActivities)

export const logActivity = async (activity) => {
  if (db) return addWithTimestamps(COLLECTION, activity)
  const record = {
    id: `act-${Date.now()}`,
    ...activity,
    time: 'Just now',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  createRecord(COLLECTION, record)
  return record.id
}

export const getActivityLogs = async () => {
  if (db) return getAllOrdered(COLLECTION, 'createdAt', 'desc')
  return readCollection(COLLECTION, seedActivities)
}
