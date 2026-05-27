import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/shared/Navbar";
import CustomerSidebar from "../components/customer/CustomerSidebar";
import Footer from "../components/shared/Footer";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1">
        <CustomerSidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8 min-w-0">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
      <div className="lg:ml-64">
        <Footer />
      </div>
    </div>
  );
}
