import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../components/shared/Navbar'
import CustomerSidebar from '../components/customer/CustomerSidebar'

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <CustomerSidebar />
        {/* Always offset by sidebar width on desktop; sidebar handles its own mobile drawer */}
        <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8 min-w-0">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
