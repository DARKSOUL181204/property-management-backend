import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { Plus, Building, MapPin, Search, X } from "lucide-react";
import Badge from "./ui/Badge";
import { motion } from "framer-motion";

export default function Properties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProp, setNewProp] = useState({
    name: "",
    description: "",
    imageUrl: "",
    propertyType: "RESIDENTIAL",
    transactionType: "BUY",
    totalUnits: 1,
    status: "ACTIVE",
    buildCost: 0,
  });
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const focusRef = useRef<HTMLInputElement>(null);

  const fetchProperties = () => {
    api
      .get("/properties")
      .then((res) => setProperties(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (showAddModal && focusRef.current) {
      focusRef.current.focus();
    }
  }, [showAddModal]);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    setAddError(null);
    setIsAdding(true);
    try {
      await api.post("/properties", newProp);
      setShowAddModal(false);
      setAddError(null);
      setNewProp({
        name: "",
        description: "",
        imageUrl: "",
        propertyType: "RESIDENTIAL",
        transactionType: "BUY",
        totalUnits: 1,
        status: "ACTIVE",
        buildCost: 0,
      });
      fetchProperties();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || "Failed to add property. Please try again.";
      setAddError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsAdding(false);
    }
  };

  const filteredProperties = properties.filter((p: any) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase().trim()),
  );

  return (
    <section className="max-w-6xl mx-auto" aria-label="Properties Directory">
      {/* Add Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-property-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <span className="sr-only">Close Modal</span>
              <X />
            </button>
            <h2
              id="add-property-title"
              className="text-xl font-bold mb-4 dark:text-white"
            >
              Add New Property
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label
                  htmlFor="prop-name"
                  className="block text-sm font-medium mb-1 dark:text-gray-300"
                >
                  Property Name
                </label>
                <input
                  id="prop-name"
                  ref={focusRef}
                  required
                  value={newProp.name}
                  onChange={(e) =>
                    setNewProp({ ...newProp, name: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label
                  htmlFor="prop-desc"
                  className="block text-sm font-medium mb-1 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="prop-desc"
                  rows={3}
                  value={newProp.description}
                  onChange={(e) =>
                    setNewProp({ ...newProp, description: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="prop-img"
                  className="block text-sm font-medium mb-1 dark:text-gray-300"
                >
                  Cover Image URL
                </label>
                <input
                  id="prop-img"
                  type="url"
                  placeholder="https://..."
                  value={newProp.imageUrl}
                  onChange={(e) =>
                    setNewProp({ ...newProp, imageUrl: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="prop-tran"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Transaction
                  </label>
                  <select
                    id="prop-tran"
                    value={newProp.transactionType}
                    onChange={(e) =>
                      setNewProp({
                        ...newProp,
                        transactionType: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="BUY">Sale (Buy)</option>
                    <option value="RENT">Rent</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="prop-type"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Type
                  </label>
                  <select
                    id="prop-type"
                    value={newProp.propertyType}
                    onChange={(e) =>
                      setNewProp({ ...newProp, propertyType: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="prop-units"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Units
                  </label>
                  <input
                    id="prop-units"
                    type="number"
                    required
                    value={newProp.totalUnits}
                    onChange={(e) =>
                      setNewProp({
                        ...newProp,
                        totalUnits: parseInt(e.target.value),
                      })
                    }
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="prop-buildCost"
                    className="block text-sm font-medium mb-1 dark:text-gray-300"
                  >
                    Initial Build Cost (₹)
                  </label>
                  <input
                    id="prop-buildCost"
                    type="number"
                    required
                    value={newProp.buildCost}
                    onChange={(e) =>
                      setNewProp({
                        ...newProp,
                        buildCost: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              {addError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3 text-sm text-red-700 dark:text-red-300">
                  ⚠️ {addError}
                </div>
              )}
              <button
                type="submit"
                disabled={isAdding}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-sm mt-4"
              >
                {isAdding ? "Saving..." : "Save Property"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Property Directory
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition flex items-center shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
        >
          <Plus size={16} className="mr-1" /> Add Property
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              aria-label="Search properties"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
              <th className="p-4 font-medium">Property Name</th>
              <th className="p-4 font-medium hidden sm:table-cell">Location</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredProperties.map((p: any) => (
              <motion.tr
                key={p.propertyId}
                whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                onClick={() => navigate(`/properties/${p.propertyId}`)}
                className="cursor-pointer group transition-colors focus-within:bg-emerald-50 dark:focus-within:bg-emerald-900/10"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    navigate(`/properties/${p.propertyId}`);
                }}
              >
                <td className="p-4 flex items-center">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500 sm:hidden flex items-center mt-0.5">
                      <MapPin size={10} className="mr-0.5" /> {p.name.split(" ").slice(2).join(" ")}
                    </p>
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1 text-gray-400" /> {p.name.split(" ").slice(2).join(" ")},
                    TN
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                  {p.propertyType || "Residential"}
                </td>
                
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    p.healthState === 'EXCELLENT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    p.healthState === 'GOOD' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    p.healthState === 'MODERATE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {p.healthState || 'MODERATE'}
                  </span>
                </td>
                <td className="p-4 text-right">

                  <Badge
                    variant={p.status === "ACTIVE" ? "success" : "neutral"}
                  >
                    {p.status}
                  </Badge>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredProperties.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No properties found.
          </div>
        )}
      </div>
    </section>
  );
}
