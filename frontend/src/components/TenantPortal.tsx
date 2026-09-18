import { useEffect, useState } from "react";
import api from "../api";
import {
  Home,
  Wrench,
  CreditCard,
  Calendar,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function TenantPortal() {
  const [leases, setLeases] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReq, setNewReq] = useState({
    category: "PLUMBING",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserEmail(decoded.sub);
      } catch (e) {}
    }

    fetchData();
  }, [userEmail]);

  const fetchData = () => {
    if (!userEmail) return;
    api.get("/rental-tenants").then((res) => {
      const myTenant = res.data.find((t: any) => t.email === userEmail);
      setTenantInfo(myTenant || null);
      if (myTenant) {
        api.get("/maintenance-requests").then((mRes) => {
          setMaintenance(
            mRes.data.filter(
              (m: any) =>
                m.rentalTenantRentalTenantId === myTenant.rentalTenantId,
            ).reverse(),
          );
        });
        
        api.get("/properties").then((pRes) => {
           const props = pRes.data;
           const sampleProp = props.length > 0 ? props[0] : { maintenanceFee: 5000, name: 'Enclave Residency' };
           
           setLeases([
             {
               id: 1,
               propertyName: sampleProp.name,
               propertyId: sampleProp.propertyId,
               monthlyRent: 25000,
               maintenanceFee: sampleProp.maintenanceFee || 5000,
               nextDueDate: "2026-10-01",
               status: "ACTIVE",
             },
           ]);
        });
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSubmitRequest = (e: any) => {
    e.preventDefault();
    if (!tenantInfo) return;

    // Prevent duplicate active requests for same category
    const hasActiveDuplicate = maintenance.some(
      (m) =>
        m.category === newReq.category &&
        (m.status === "PENDING" ||
          m.status === "PARTIALLY_RESOLVED" ||
          m.status === "APPROVED"),
    );

    if (hasActiveDuplicate) {
      alert(
        `You already have an active request for ${newReq.category}. Please wait for it to be resolved.`,
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      category: newReq.category,
      description: newReq.description,
      status: "PENDING",
      requestDate: new Date().toISOString().split("T")[0],
      rentalTenantRentalTenantId: tenantInfo.rentalTenantId,
    };

    api
      .post("/maintenance-requests", payload)
      .then(() => {
        setIsModalOpen(false);
        setNewReq({ category: "PLUMBING", description: "" });
        fetchData(); // refresh list
      })
      .catch(console.error)
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Home className="text-blue-600" />
            <span className="font-black text-xl text-slate-900 dark:text-white">My Portal</span>
        </div>
        <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Browse Properties
            </button>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors flex items-center text-sm font-bold">
                <LogOut size={16} className="mr-2" /> Sign Out
            </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">
          Welcome back!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <CreditCard size={24} />
            </div>
            <div>
              <h2 className="text-slate-500 font-semibold mb-1">
                Next Rent Payment
              </h2>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ₹25,000
              </p>
              <p className="text-sm text-amber-600 font-medium mt-1 flex items-center">
                <Calendar size={14} className="mr-1" /> Due on Oct 1st, 2026
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Home size={24} />
            </div>
            <div>
              <h2 className="text-slate-500 font-semibold mb-1">
                My Residence
              </h2>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                Unit A-204
              </p>
              <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center">
                <CheckCircle2 size={14} className="mr-1" /> Lease Active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Wrench className="mr-2 text-slate-500" /> Maintenance Requests
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-md"
            >
              New Request
            </button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Requested On</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {maintenance.map((m: any) => (
                <tr
                  key={m.requestId}
                  className="border-b border-slate-100 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">
                    {m.category}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {m.description || "Routine maintenance"}
                    {m.status === "PARTIALLY_RESOLVED" && m.scheduledDate && (
                      <div className="mt-1 text-xs text-blue-600 font-bold">
                        Technician scheduled for: {m.scheduledDate}
                      </div>
                    )}
                    {m.status === "DENIED" && m.denyReason && (
                      <div className="mt-1 text-xs text-red-600 font-bold">
                        Reason: {m.denyReason}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {m.requestDate || "2026-09-10"}
                  </td>
                  <td className="p-4">
                    {m.status === "PENDING" && (
                      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold text-xs">
                        PENDING
                      </span>
                    )}
                    {m.status === "APPROVED" && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold text-xs">
                        APPROVED
                      </span>
                    )}
                    {m.status === "PARTIALLY_RESOLVED" && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold text-xs whitespace-nowrap">
                        TECH SCHEDULED
                      </span>
                    )}
                    {m.status === "DENIED" && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-xs">
                        DENIED
                      </span>
                    )}
                    {m.status === "COMPLETED" && (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold text-xs">
                        COMPLETED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {maintenance.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <CheckCircle2
                        size={32}
                        className="text-emerald-500 mb-2"
                      />
                      No active maintenance requests. Everything looks good!
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Submit Maintenance Request
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={newReq.category}
                  onChange={(e) =>
                    setNewReq({ ...newReq, category: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none text-slate-900 dark:text-white"
                >
                  <option value="PLUMBING">Plumbing</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="APPLIANCE">Appliance Repair</option>
                  <option value="HVAC">AC/Heating</option>
                  <option value="STRUCTURAL">Structural/Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={newReq.description}
                  onChange={(e) =>
                    setNewReq({ ...newReq, description: e.target.value })
                  }
                  placeholder="Please describe the issue in detail..."
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none text-slate-900 dark:text-white resize-none"
                ></textarea>
              </div>
              <div className="pt-2">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
