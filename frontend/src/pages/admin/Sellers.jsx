import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Search, UserCheck, UserX, Store } from "lucide-react";
import adminService from "../../services/adminService";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
} from "../../animations/variants";
import { debounce } from "../../utils";
import Skeleton from "../../components/ui/Skeleton";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchSellers = useCallback(() => {
    setLoading(true);
    adminService
      .getSellers({ page, size: 10, sort: "id", email: email || undefined })
      .then((res) => setSellers(res.data || []))
      .catch(() => toast.error("Failed to load sellers"))
      .finally(() => setLoading(false));
  }, [page, email]);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const debouncedSearch = useCallback(
    debounce((val) => {
      setEmail(val);
      setPage(0);
    }, 400),
    [],
  );

  const handleConfirm = async () => {
    const { id, action } = confirmAction;
    try {
      if (action === "activate") await adminService.activateSeller(id);
      else await adminService.deactivateSeller(id);
      toast.success(`Seller ${action}d successfully`);
      setConfirmAction(null);
      fetchSellers();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} seller`);
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Sellers
        </h1>
        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            defaultValue={email}
            onChange={(e) => debouncedSearch(e.target.value)}
            placeholder="Search by email..."
            className="input pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No sellers found"
          description="No sellers match your search"
        />
      ) : (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="card overflow-hidden"
          >
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Seller</th>
                    <th>Email</th>
                    <th>GST</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((s) => (
                    <motion.tr key={s.id} variants={staggerItem}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {s.companyName?.[0] || "S"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {s.companyName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {s.firstName} {s.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-500">{s.email}</td>
                      <td className="text-gray-500 font-mono text-xs">
                        {s.gst || "—"}
                      </td>
                      <td className="text-gray-500">
                        {s.companyContact || "—"}
                      </td>
                      <td>
                        <Badge variant={s.isActive ? "success" : "danger"}>
                          {s.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td>
                        {s.isActive ? (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                id: s.id,
                                action: "deactivate",
                                name: s.companyName,
                              })
                            }
                            className="btn-sm btn text-red-600 hover:bg-red-50 dark:hover:bg-red-950 gap-1"
                          >
                            <UserX size={14} /> Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                id: s.id,
                                action: "activate",
                                name: s.companyName,
                              })
                            }
                            className="btn-sm btn text-green-600 hover:bg-green-50 dark:hover:bg-green-950 gap-1"
                          >
                            <UserCheck size={14} /> Activate
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          <Pagination
            page={page}
            onPageChange={setPage}
            hasNext={sellers.length === 10}
          />
        </>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        title={`${confirmAction?.action === "activate" ? "Activate" : "Deactivate"} Seller`}
        message={`Are you sure you want to ${confirmAction?.action} ${confirmAction?.name}?`}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
        confirmLabel={
          confirmAction?.action === "activate" ? "Activate" : "Deactivate"
        }
        variant={confirmAction?.action === "activate" ? "primary" : "danger"}
      />
    </motion.div>
  );
}
