import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopNav from '../components/TopNav'
import ToastStack from '../components/ToastStack'
import UploadInvoiceModal from '../components/UploadInvoiceModal'
import VendorModal from '../components/VendorModal'
import { useAppData } from '../context/AppDataContext'

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { toasts, dismissToast, saveInvoice, searchQuery, setSearchQuery, isUploading, isUploadOpen, openUpload, closeUpload, isVendorEditorOpen, editingVendor, closeVendorEditor, saveVendor, isSavingVendor, removeVendorById } = useAppData()
  return (
    <div className="h-screen overflow-hidden bg-[#f6f3ec] text-slate-900">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />
      <div className={`flex h-screen min-w-0 flex-col overflow-hidden ${sidebarCollapsed ? 'lg:pl-[84px]' : 'lg:pl-[256px]'}`}>
        <TopNav
          onMenu={() => setMobileNavOpen(true)}
          onUpload={openUpload}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 sm:px-5 lg:px-6">
          <div className="mx-auto max-w-[1480px] min-w-0">
            <Outlet />
          </div>
        </main>
      </div>

      <UploadInvoiceModal
        key={isUploadOpen ? 'upload-open' : 'upload-closed'}
        open={isUploadOpen}
        onClose={closeUpload}
        onUpload={saveInvoice}
        isUploading={isUploading}
      />

      <VendorModal
        key={editingVendor?.id || 'new-vendor'}
        open={isVendorEditorOpen}
        vendor={editingVendor}
        onClose={closeVendorEditor}
        onSave={saveVendor}
        onDelete={removeVendorById}
        isSaving={isSavingVendor}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
