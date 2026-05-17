import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export const collectionRef = (name) => collection(db, name)

export const addWithTimestamps = async (name, data) => {
  const docRef = await addDoc(collectionRef(name), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export const updateWithTimestamp = async (name, id, data) => {
  await updateDoc(doc(db, name, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const getById = async (name, id) => {
  const snapshot = await getDoc(doc(db, name, id))
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

export const getAllOrdered = async (name, orderField = 'createdAt', direction = 'desc') => {
  const q = query(collectionRef(name), orderBy(orderField, direction))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }))
}

export const deleteById = async (name, id) => {
  await deleteDoc(doc(db, name, id))
}

export const listenToOrderedCollection = (name, callback, orderField = 'createdAt', direction = 'desc') => {
  if (!db) {
    return () => {}
  }

  const q = query(collectionRef(name), orderBy(orderField, direction))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })))
  })
}
