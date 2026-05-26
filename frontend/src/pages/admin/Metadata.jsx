import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Search, Tag, X, Save, Database } from "lucide-react";
import { metadataFieldSchema } from "../../utils/validators";
import adminService from "../../services/adminService";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
  fadeInUp,
} from "../../animations/variants";
import { debounce } from "../../utils";
import Skeleton from "../../components/ui/Skeleton";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import FormField from "../../components/ui/FormField";

export default function AdminMetadata() {
  const [fields, setFields] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [showValuesForm, setShowValuesForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [valuesForm, setValuesForm] = useState({
    categoryId: "",
    metadataFieldId: "",
    values: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(metadataFieldSchema),
  });

  const fetchFields = useCallback(() => {
    setLoading(true);
    adminService
      .getAllMetadataFields({
        page,
        size: 10,
        sort: "id",
        order: "asc",
        filter: filter || undefined,
      })
      .then((res) => setFields(res.data || []))
      .catch(() => toast.error("Failed to load metadata fields"))
      .finally(() => setLoading(false));
  }, [page, filter]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);
  useEffect(() => {
    adminService
      .getAllCategories({ page: 0, size: 100 })
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  const debouncedSearch = useCallback(
    debounce((val) => {
      setFilter(val);
      setPage(0);
    }, 400),
    [],
  );

  const onAddField = async (data) => {
    setSaving(true);
    try {
      await adminService.addMetadataField(data);
      toast.success("Metadata field added!");
      reset();
      setShowFieldForm(false);
      fetchFields();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        "Failed to add field";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const onAddValues = async () => {
    if (
      !valuesForm.categoryId ||
      !valuesForm.metadataFieldId ||
      !valuesForm.values
    ) {
      toast.error("All fields are required");
      return;
    }
    setSaving(true);
    try {
      const valuesArray = valuesForm.values
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      await adminService.addMetadataValues({
        categoryId: Number(valuesForm.categoryId),
        metadataFieldValues: [
          {
            categoryMetadataFieldId: Number(valuesForm.metadataFieldId),
            values: valuesArray.join(","),
          },
        ],
      });
      toast.success("Metadata values added!");
      setValuesForm({ categoryId: "", metadataFieldId: "", values: "" });
      setShowValuesForm(false);
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        "Failed to add values";
      toast.error(msg);
    } finally {
      setSaving(false);
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
          Metadata Fields
        </h1>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              defaultValue={filter}
              onChange={(e) => debouncedSearch(e.target.value)}
              placeholder="Search..."
              className="input pl-9 w-40"
            />
          </div>
          <button
            onClick={() => setShowValuesForm(!showValuesForm)}
            className="btn-secondary btn-sm"
          >
            <Database size={14} /> Add Values
          </button>
          <button
            onClick={() => setShowFieldForm(!showFieldForm)}
            className="btn-primary btn-sm"
          >
            <Plus size={16} /> Add Field
          </button>
        </div>
      </div>

      {/* Add Field Form */}
      <AnimatePresence>
        {showFieldForm && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="card p-5 max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Add Metadata Field
              </h2>
              <button
                onClick={() => setShowFieldForm(false)}
                className="btn-icon btn-ghost"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onAddField)} className="space-y-4">
              <FormField label="Field Name *" error={errors.name?.message}>
                <input
                  {...register("name")}
                  placeholder="e.g. Color, Size, Material"
                  className={`input ${errors.name ? "input-error" : ""}`}
                />
              </FormField>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? (
                    "Adding..."
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save size={16} /> Add Field
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFieldForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Values Form */}
      <AnimatePresence>
        {showValuesForm && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="card p-5 max-w-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Add Metadata Values
              </h2>
              <button
                onClick={() => setShowValuesForm(false)}
                className="btn-icon btn-ghost"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Category *</label>
                <select
                  value={valuesForm.categoryId}
                  onChange={(e) =>
                    setValuesForm({ ...valuesForm, categoryId: e.target.value })
                  }
                  className="input"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Metadata Field *</label>
                <select
                  value={valuesForm.metadataFieldId}
                  onChange={(e) =>
                    setValuesForm({
                      ...valuesForm,
                      metadataFieldId: e.target.value,
                    })
                  }
                  className="input"
                >
                  <option value="">Select field</option>
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Values (comma-separated) *</label>
                <input
                  value={valuesForm.values}
                  onChange={(e) =>
                    setValuesForm({ ...valuesForm, values: e.target.value })
                  }
                  placeholder="Red, Blue, Green"
                  className="input"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onAddValues}
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? (
                    "Adding..."
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save size={16} /> Add Values
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowValuesForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : fields.length === 0 ? (
        <EmptyState
          icon={Database}
          title="No metadata fields"
          description="Add metadata fields to categorize product attributes"
          action={{ label: "Add Field", onClick: () => setShowFieldForm(true) }}
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
                    <th>ID</th>
                    <th>Field Name</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((f) => (
                    <motion.tr key={f.id} variants={staggerItem}>
                      <td className="text-gray-400 font-mono text-xs">
                        #{f.id}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-primary-500" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {f.name}
                          </span>
                        </div>
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
            hasNext={fields.length === 10}
          />
        </>
      )}
    </motion.div>
  );
}
