const escapeCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`

export function downloadCsv(filename, rows = []) {
  if (typeof window === 'undefined' || rows.length === 0) return

  const headers = Object.keys(rows[0])
  const body = [headers.map(escapeCell).join(',')]
    .concat(rows.map((row) => headers.map((header) => escapeCell(row[header])).join(',')))
    .join('\n')

  const blob = new Blob([body], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}