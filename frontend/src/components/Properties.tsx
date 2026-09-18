import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  Plus,
  Building,
  MapPin,
  Search,
  Trash2,
  X,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HEALTH_COLORS: Record<string, string> = {
  EXCELLENT:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  GOOD: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  MODERATE:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  POOR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  INACTIVE: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

const emptyForm = {
  name: "",
  description: "",
  imageUrl: "",
  propertyType: "RESIDENTIAL",
  transactionType: "RENT",
  totalUnits: 1,
  status: "ACTIVE",
  buildCost: 0,
};

export default function Properties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  const fetchProperties = () => {
    api
      .get("/properties")
      .then((res) => setProperties(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (showAddModal) setTimeout(() => nameRef.current?.focus(), 100);
  }, [showAddModal]);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    setAddError(null);
    setIsAdding(true);
    try {
      await api.post("/properties", form);
      setShowAddModal(false);
      setForm({ ...emptyForm });
      fetchProperties();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Failed to save. Please try again.";
      setAddError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (e: any, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Delete this property? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/properties/${id}`);
      fetchProperties();
    } catch (err: any) {
      alert(
        "Failed to delete: " + (err?.response?.data?.message || err?.message),
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = properties.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase().trim()),
  );

  const cityFromName = (name: string) =>
    name?.split(" ").slice(2).join(" ") || "—";

  return (
    <section className="max-w-6xl mx-auto" aria-label="Properties Directory">
      {/* ─── Add Modal ─── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddModal(false);
                setAddError(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Building size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">
                        Add New Property
                      </h2>
                      <p className="text-emerald-100 text-sm">
                        Fill in the details below
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setAddError(null);
                    }}
                    className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <form
                onSubmit={handleAdd}
                className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={nameRef}
                    required
                    placeholder="e.g. Project 512 Mumbai"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    placeholder="Brief description of the property..."
                    rows={2}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                  />
                </div>

                {/* Row: Type + Transaction */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Property Type
                    </label>
                    <select
                      value={form.propertyType}
                      onChange={(e) =>
                        setForm({ ...form, propertyType: e.target.value })
                      }
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    >
                      <option value="RESIDENTIAL">Residential</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="MIXED">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Listing Type
                    </label>
                    <select
                      value={form.transactionType}
                      onChange={(e) =>
                        setForm({ ...form, transactionType: e.target.value })
                      }
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    >
                      <option value="RENT">For Rent</option>
                      <option value="BUY">For Sale</option>
                    </select>
                  </div>
                </div>

                {/* Row: Units + Build Cost */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Total Units
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={form.totalUnits}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          totalUnits: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Build Cost (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.buildCost}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          buildCost: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>

                {/* Error Banner */}
                {addError && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-3 text-sm text-red-700 dark:text-red-300 flex gap-2 items-start">
                    <span className="mt-0.5">⚠️</span>
                    <span>{addError}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setAddError(null);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold transition shadow-sm"
                  >
                    {isAdding ? "Saving..." : "Save Property"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Header ─── */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Property Directory
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={16} /> Add Property
        </button>
      </div>

      {/* ─── Table Card ─── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading properties...</span>
          </div>
        ) : properties.length === 0 ? (
          /* Empty state - no properties in org */
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4">
              <Building
                size={36}
                className="text-gray-400 dark:text-gray-500"
              />
            </div>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-1">
              No Properties Found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
              This organisation doesn't have any properties yet. Add your first
              one to get started!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow"
            >
              <Plus size={16} /> Add First Property
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400 dark:text-gray-500 text-sm">
            No properties match your search.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-medium">Property</th>
                <th className="p-4 font-medium hidden sm:table-cell">
                  Location
                </th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium text-center">Health</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((p: any) => (
                <motion.tr
                  key={p.propertyId}
                  whileHover={{ backgroundColor: "rgba(16,185,129,0.04)" }}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/properties/${p.propertyId}`)}
                >
                  {/* Name + thumbnail */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 text-sm">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-400 sm:hidden mt-0.5 flex items-center gap-0.5">
                          <MapPin size={10} /> {cityFromName(p.name)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="p-4 hidden sm:table-cell text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-gray-400" />
                      {cityFromName(p.name)}, IN
                    </span>
                  </td>

                  {/* Type */}
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {(p.propertyType || "RESIDENTIAL").toLowerCase()}
                  </td>

                  {/* Health */}
                  <td className="p-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${HEALTH_COLORS[p.healthState] || HEALTH_COLORS.MODERATE}`}
                    >
                      {p.healthState || "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[p.status] || STATUS_COLORS.INACTIVE}`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td
                    className="p-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/properties/${p.propertyId}`)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
                        title="View details"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, p.propertyId)}
                        disabled={deletingId === p.propertyId}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-40"
                        title="Delete property"
                      >
                        {deletingId === p.propertyId ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
