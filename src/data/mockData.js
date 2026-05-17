export const kpiMetrics = [
  {
    id: 'kpi-1',
    title: 'Total vendors',
    value: '48',
    delta: '+6 this quarter',
    tone: 'gold',
  },
  {
    id: 'kpi-2',
    title: 'Invoices this month',
    value: '126',
    delta: '+18 vs last month',
    tone: 'ink',
  },
  {
    id: 'kpi-3',
    title: 'Approvals pending',
    value: '12',
    delta: '3 require follow up',
    tone: 'amber',
  },
  {
    id: 'kpi-4',
    title: 'Overdue exposure',
    value: '$84,260',
    delta: '7 invoices overdue',
    tone: 'rose',
  },
]

export const invoices = [
  {
    id: 'inv-1001',
    vendor: 'Atlas Fabrication',
    number: 'INV-1042',
    amount: 12480.5,
    dueDate: '2026-05-26',
    status: 'received',
    aiStatus: 'matched',
  },
  {
    id: 'inv-1002',
    vendor: 'Northwind Logistics',
    number: 'NL-8821',
    amount: 8420,
    dueDate: '2026-05-20',
    status: 'approved',
    aiStatus: 'matched',
  },
  {
    id: 'inv-1003',
    vendor: 'Helios Energy',
    number: 'HE-4471',
    amount: 19600,
    dueDate: '2026-05-10',
    status: 'overdue',
    aiStatus: 'needs review',
  },
  {
    id: 'inv-1004',
    vendor: 'Keystone Realty',
    number: 'KR-3021',
    amount: 5620,
    dueDate: '2026-06-02',
    status: 'received',
    aiStatus: 'matched',
  },
  {
    id: 'inv-1005',
    vendor: 'Summit Supplies',
    number: 'SS-1189',
    amount: 3120,
    dueDate: '2026-06-06',
    status: 'paid',
    aiStatus: 'matched',
  },
]

export const vendors = [
  {
    id: 'ven-1',
    name: 'Atlas Fabrication',
    category: 'Manufacturing',
    contact: 'Ava Moreno',
    email: 'ava.moreno@atlasfab.co',
    phone: '+1 415 555 3121',
    status: 'active',
    risk: 'low',
    outstanding: 12480.5,
    since: '2022',
  },
  {
    id: 'ven-2',
    name: 'Northwind Logistics',
    category: 'Logistics',
    contact: 'Henry Collins',
    email: 'henry@northwind.io',
    phone: '+1 212 555 8202',
    status: 'active',
    risk: 'medium',
    outstanding: 8420,
    since: '2021',
  },
  {
    id: 'ven-3',
    name: 'Helios Energy',
    category: 'Energy',
    contact: 'Jules Park',
    email: 'jules@heliosenergy.com',
    phone: '+1 713 555 4490',
    status: 'review',
    risk: 'high',
    outstanding: 19600,
    since: '2023',
  },
  {
    id: 'ven-4',
    name: 'Summit Supplies',
    category: 'Office',
    contact: 'Naomi Kim',
    email: 'naomi@summitsupplies.com',
    phone: '+1 646 555 7781',
    status: 'active',
    risk: 'low',
    outstanding: 3120,
    since: '2020',
  },
]

export const activities = [
  {
    id: 'act-1',
    title: 'Invoice INV-1042 uploaded by Atlas Fabrication',
    time: '12 min ago',
    meta: 'AI extraction complete',
  },
  {
    id: 'act-2',
    title: 'Work verification completed for NL-8821',
    time: '2 hours ago',
    meta: 'Awaiting approval',
  },
  {
    id: 'act-3',
    title: 'Payment released for Summit Supplies',
    time: 'Yesterday',
    meta: '$3,120 sent',
  },
]

export const verifications = [
  {
    id: 'ver-1',
    invoiceId: 'inv-1001',
    invoiceNumber: 'INV-1042',
    vendor: 'Atlas Fabrication',
    status: 'pending',
    notes: '',
    proof: '',
    checklist: [
      { id: 'task-1', label: 'Work scope confirmed', done: true },
      { id: 'task-2', label: 'Deliverables uploaded', done: false },
      { id: 'task-3', label: 'Proof of completion attached', done: false },
    ],
  },
  {
    id: 'ver-2',
    invoiceId: 'inv-1002',
    invoiceNumber: 'NL-8821',
    vendor: 'Northwind Logistics',
    status: 'completed',
    notes: 'Signed delivery manifest received.',
    proof: 'Delivery log attached',
    checklist: [
      { id: 'task-4', label: 'Work scope confirmed', done: true },
      { id: 'task-5', label: 'Deliverables uploaded', done: true },
      { id: 'task-6', label: 'Proof of completion attached', done: true },
    ],
  },
  {
    id: 'ver-3',
    invoiceId: 'inv-1003',
    invoiceNumber: 'HE-4471',
    vendor: 'Helios Energy',
    status: 'in review',
    notes: 'Awaiting completion photos from field team.',
    proof: '',
    checklist: [
      { id: 'task-7', label: 'Work scope confirmed', done: true },
      { id: 'task-8', label: 'Deliverables uploaded', done: false },
      { id: 'task-9', label: 'Proof of completion attached', done: false },
    ],
  },
]

export const alerts = [
  {
    id: 'alert-1',
    title: 'HE-4471 is overdue',
    detail: '5 days past due, follow up with Helios Energy.',
    tone: 'critical',
  },
  {
    id: 'alert-2',
    title: '3 invoices missing work verification',
    detail: 'Atlas Fabrication, Keystone Realty, Helios Energy.',
    tone: 'warning',
  },
]

export const approvals = [
  {
    id: 'appr-1',
    vendor: 'Atlas Fabrication',
    invoiceNumber: 'INV-1042',
    invoiceId: 'inv-1001',
    amount: 12480.5,
    dueDate: '2026-05-26',
    status: 'pending',
  },
  {
    id: 'appr-2',
    vendor: 'Northwind Logistics',
    invoiceNumber: 'NL-8821',
    invoiceId: 'inv-1002',
    amount: 8420,
    dueDate: '2026-05-20',
    status: 'approved',
  },
  {
    id: 'appr-3',
    vendor: 'Helios Energy',
    invoiceNumber: 'HE-4471',
    invoiceId: 'inv-1003',
    amount: 19600,
    dueDate: '2026-05-10',
    status: 'pending',
  },
]

export const payments = [
  {
    id: 'pay-1',
    vendor: 'Summit Supplies',
    invoiceNumber: 'SS-1189',
    invoiceId: 'inv-1005',
    amount: 3120,
    method: 'ACH',
    status: 'paid',
    date: 'May 14, 2026',
  },
  {
    id: 'pay-2',
    vendor: 'Northwind Logistics',
    invoiceNumber: 'NL-8821',
    invoiceId: 'inv-1002',
    amount: 8420,
    method: 'Wire',
    status: 'scheduled',
    date: 'May 21, 2026',
  },
]
