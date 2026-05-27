import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Edit2, ArrowLeft, Image, X, Save } from "lucide-react";
import sellerService from "../../services/sellerService";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
  fadeInUp,
} from "../../animations/variants";
import { formatCurrency } from "../../utils";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import FormField from "../../components/ui/FormField";

export default function SellerVariations() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [variations, setVariations] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [metadataFields, setMetadataFields] = useState([]);
  const fileRef = useRef();

  const [form, setForm] = useState({
    price: "",
    quantityAvailable: "",
    metadata: {},
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      sellerService.getProduct(productId),
      sellerService.getAllVariations({ productId, page: 0, size: 20 }),
      sellerService.getLeafCategories(),
    ])
      .then(([pRes, vRes, cRes]) => {
        setProduct(pRes.data);
        setVariations(vRes.data || []);
        // Find the category matching this product and extract its metadata fields
        const categories = cRes.data || [];
        const productCategory = categories.find(
          (c) => c.categoryId === pRes.data.categoryId,
        );
        setMetadataFields(productCategory?.metadataFields || []);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  const openAdd = () => {
    // Initialize metadata with empty values for each field
    const emptyMeta = {};
    metadataFields.forEach((f) => {
      emptyMeta[f.metadataFieldName] = "";
    });
    setForm({ price: "", quantityAvailable: "", metadata: emptyMeta });
    setEditId(null);
    setImagePreview(null);
    setShowForm(true);
  };
  const openEdit = (v) => {
    const existingMeta = v.metaData || {};
    // Merge with available fields so all fields show up
    const mergedMeta = {};
    metadataFields.forEach((f) => {
      mergedMeta[f.metadataFieldName] = existingMeta[f.metadataFieldName] || "";
    });
    setForm({
      price: v.price || "",
      quantityAvailable: v.quantityAvailable || "",
      metadata: mergedMeta,
    });
    setEditId(v.id);
    setImagePreview(v.imageUrl || null);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setImagePreview(null);
  };

  const handleMetadataChange = (fieldName, value) => {
    setForm((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [fieldName]: value },
    }));
  };

  const handleSave = async () => {
    if (!form.price) {
      toast.error("Price is required");
      return;
    }
    // Validate that at least one metadata field is selected
    const filledMeta = Object.entries(form.metadata).filter(([, v]) => v);
    if (metadataFields.length > 0 && filledMeta.length === 0) {
      toast.error("Please select at least one attribute");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("price", form.price);
      formData.append("quantityAvailable", form.quantityAvailable || 0);
      // Append metadata key-value pairs
      filledMeta.forEach(([key, value]) => {
        formData.append(`metaData[${key}]`, value);
      });
      if (!editId) formData.append("productId", productId);
      if (fileRef.current?.files[0])
        formData.append("primaryImage", fileRef.current.files[0]);

      if (editId) {
        await sellerService.updateVariation(editId, formData);
        toast.success("Variation updated!");
      } else {
        await sellerService.addVariation(formData);
        toast.success("Variation added!");
      }
      closeForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save variation");
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
      className="space-y-6 max-w-4xl"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/seller/products")}
          className="btn-icon btn-ghost"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Product Variations
          </h1>
          {product && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {product.name}
            </p>
          )}
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm ml-auto">
          <Plus size={16} /> Add Variation
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {editId ? "Edit Variation" : "Add Variation"}
              </h2>
              <button onClick={closeForm} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Price *">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className="input"
                  min="0"
                  step="0.01"
                />
              </FormField>
              <FormField label="Quantity Available">
                <input
                  type="number"
                  value={form.quantityAvailable}
                  onChange={(e) =>
                    setForm({ ...form, quantityAvailable: e.target.value })
                  }
                  placeholder="0"
                  className="input"
                  min="0"
                />
              </FormField>
            </div>
            {/* Metadata Fields */}
            {metadataFields.length > 0 && (
              <div className="mt-4">
                <label className="label">Attributes</label>
                <div className="grid sm:grid-cols-2 gap-4 mt-1">
                  {metadataFields.map((field) => (
                    <FormField
                      key={field.metadataFieldId}
                      label={field.metadataFieldName}
                    >
                      <select
                        value={form.metadata[field.metadataFieldName] || ""}
                        onChange={(e) =>
                          handleMetadataChange(
                            field.metadataFieldName,
                            e.target.value,
                          )
                        }
                        className="input"
                      >
                        <option value="">
                          Select {field.metadataFieldName}
                        </option>
                        {(field.values || []).map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div className="mt-4">
              <label className="label">Product Image</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image size={24} className="text-gray-300" />
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="btn-secondary btn-sm"
                  >
                    <Image size={14} />{" "}
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </button>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG up to 5MB
                  </p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) setImagePreview(URL.createObjectURL(f));
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <span className="flex items-center gap-2">
                    <Save size={16} /> {editId ? "Update" : "Add"} Variation
                  </span>
                )}
              </button>
              <button onClick={closeForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variations List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : variations.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No variations yet"
          description="Add product variations with different prices and attributes"
          action={{ label: "Add Variation", onClick: openAdd }}
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {variations.map((v) => (
            <motion.div
              key={v.id}
              variants={staggerItem}
              className="card overflow-hidden"
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {v.imageUrl ? (
                  <img
                    src={v.imageUrl}
                    alt="variation"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Image size={32} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(v.price || 0)}
                  </span>
                  <span
                    className={`badge ${v.isActive ? "badge-success" : "badge-danger"}`}
                  >
                    {v.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Qty: {v.quantityAvailable || 0}
                </p>
                {v.metaData && Object.keys(v.metaData).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(v.metaData).map(([k, val]) => (
                      <span key={k} className="badge badge-primary text-xs">
                        {k}: {val}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => openEdit(v)}
                  className="btn-secondary btn-sm w-full mt-3"
                >
                  <Edit2 size={14} /> Edit
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
