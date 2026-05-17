import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Invoices from './pages/Invoices'
import Approvals from './pages/Approvals'
import Vendors from './pages/Vendors'
import AppLayout from './layouts/AppLayout'
import Payments from './pages/Payments'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import Verifications from './pages/Verifications'
import ActivityLogs from './pages/ActivityLogs'
import VendorDetail from './pages/VendorDetail'
import Login from './pages/Login'
import { useAppData } from './context/AppDataContext'

function ProtectedRoute({ children }) {
  const { session } = useAppData()
  return session.isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="vendors/:vendorId" element={<VendorDetail />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="verifications" element={<Verifications />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="payments" element={<Payments />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="activity-logs" element={<ActivityLogs />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
