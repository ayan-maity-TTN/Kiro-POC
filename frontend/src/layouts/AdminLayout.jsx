import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../components/shared/Navbar'
import AdminSidebar from '../components/admin/AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8 min-w-0">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
