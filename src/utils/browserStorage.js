const STORAGE_PREFIX = 'vendorpay:'

const makeKey = (name) => `${STORAGE_PREFIX}${name}`

export const readCollection = (name, fallback = []) => {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(makeKey(name))
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const writeCollection = (name, value) => {
  if (typeof window === 'undefined') return value
  window.localStorage.setItem(makeKey(name), JSON.stringify(value))
  return value
}

export const createRecord = (name, record) => {
  const current = readCollection(name)
  const next = [record, ...current]
  writeCollection(name, next)
  return record
}

export const updateRecord = (name, id, updater) => {
  const current = readCollection(name)
  const next = current.map((item) => (item.id === id ? { ...item, ...updater } : item))
  writeCollection(name, next)
  return next.find((item) => item.id === id) || null
}

export const removeRecord = (name, id) => {
  const current = readCollection(name)
  const next = current.filter((item) => item.id !== id)
  writeCollection(name, next)
  return next
}

export const ensureCollection = (name, fallback = []) => {
  const existing = readCollection(name, null)
  if (existing === null || existing === undefined) {
    return writeCollection(name, fallback)
  }
  return existing
}
