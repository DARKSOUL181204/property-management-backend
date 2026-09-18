import { useEffect, useState } from "react";
import api from "../api";
import {
  Users,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function Tenants() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [filterMode, setFilterMode] = useState("ALL");

  // Issue Action State
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [actioningIssue, setActioningIssue] = useState<string | null>(null);
  const [actionStatus, setActionStatus] =
    useState<string>("PARTIALLY_RESOLVED");
  const [actionDate, setActionDate] = useState<string>("");

  const loadData = () => {
    api
      .get("/rental-tenants")
      .then((res) => setTenants(res.data))
      .catch(console.error);
    api
      .get("/maintenance-requests")
      .then((res) => {
        setMaintenance(res.data);
        // refresh modal state if open
        if (selectedTenant) {
          setSelectedTenant((prev: any) => ({
            t: prev.t,
            issues: res.data.filter(
              (m: any) =>
                m.rentalTenantRentalTenantId === prev.t.rentalTenantId,
            ),
          }));
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getMaintenanceForTenant = (tenantId: string) => {
    return maintenance.filter(
      (m: any) => m.rentalTenantRentalTenantId === tenantId,
    );
  };

  const filteredTenants = tenants.filter((t) => {
    const issues = getMaintenanceForTenant(t.rentalTenantId);
    const pending = issues.filter((i: any) => i.status === "PENDING").length;
    if (filterMode === "PENDING") return pending > 0;
    if (filterMode === "CLEAR") return pending === 0;
    return true;
  });

  const handleUpdateIssue = (issue: any) => {
    if (actionStatus === "PARTIALLY_RESOLVED" && !actionDate) {
      alert("Please select a scheduled date for the technician.");
      return;
    }
    if (actionStatus === "DENIED" && !actionDate) {
      alert("Please provide a reason for denial.");
      return;
    }

    const payload = {
      ...issue,
      status: actionStatus,
      scheduledDate: actionStatus === "PARTIALLY_RESOLVED" ? actionDate : null,
      denyReason: actionStatus === "DENIED" ? actionDate : null,
    };

    api
      .put(`/maintenance-requests/${issue.requestId}`, payload)
      .then(() => {
        setActioningIssue(null);
        setActionDate("");
        loadData();
      })
      .catch(console.error);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Users className="mr-3 text-blue-600" /> Tenant Management
        </h1>

        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-sm">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="bg-transparent outline-none text-sm font-semibold text-gray-700 dark:text-gray-200 cursor-pointer"
          >
            <option value="ALL">All Tenants</option>
            <option value="PENDING">Has Pending Issues</option>
            <option value="CLEAR">No Pending Issues</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <th className="p-4 font-semibold text-gray-900 dark:text-white">
                Tenant Name
              </th>
              <th className="p-4 font-semibold text-gray-900 dark:text-white">
                Contact Info
              </th>
              <th className="p-4 font-semibold text-gray-900 dark:text-white">
                ID Number
              </th>
              <th className="p-4 font-semibold text-gray-900 dark:text-white">
                Status
              </th>
              <th className="p-4 font-semibold text-gray-900 dark:text-white">
                Maintenance Issues
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((t) => {
              const issues = getMaintenanceForTenant(t.rentalTenantId);
              const pending = issues.filter(
                (i: any) => i.status === "PENDING",
              ).length;

              return (
                <tr
                  key={t.rentalTenantId}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    {t.name}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {t.email}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {t.idNumber}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {issues.length > 0 ? (
                      <button
                        onClick={() => setSelectedTenant({ t, issues })}
                        className={`flex items-center text-sm font-semibold hover:underline ${pending > 0 ? "text-amber-600" : "text-blue-600"}`}
                      >
                        <AlertCircle size={16} className="mr-1" />{" "}
                        {pending > 0 ? `${pending} Pending` : "View History"}
                      </button>
                    ) : (
                      <span className="flex items-center text-emerald-600 text-sm">
                        <CheckCircle2 size={16} className="mr-1" /> All Clear
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredTenants.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No tenants found matching the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTenant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Maintenance Log: {selectedTenant.t.name}
              </h3>
              <button
                onClick={() => {
                  setSelectedTenant(null);
                  setActioningIssue(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {selectedTenant.issues.map((i: any) => (
                <div
                  key={i.requestId}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {i.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${i.status === "PENDING" ? "bg-amber-100 text-amber-700" : i.status === "PARTIALLY_RESOLVED" ? "bg-blue-100 text-blue-700" : i.status === "DENIED" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {i.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {i.description || "No description provided."}
                  </p>

                  {i.status === "PENDING" && actioningIssue !== i.requestId && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setActioningIssue(i.requestId)}
                        className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold px-4 py-1.5 rounded-lg transition-colors"
                      >
                        Take Action
                      </button>
                    </div>
                  )}

                  {actioningIssue === i.requestId && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                        Update Issue Status
                      </h4>
                      <div className="flex gap-4 mb-4">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            checked={actionStatus === "PARTIALLY_RESOLVED"}
                            onChange={() =>
                              setActionStatus("PARTIALLY_RESOLVED")
                            }
                            className="mr-2"
                          />
                          Approve / Schedule Technician
                        </label>
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            checked={actionStatus === "DENIED"}
                            onChange={() => setActionStatus("DENIED")}
                            className="mr-2"
                          />
                          Deny
                        </label>
                      </div>

                      {actionStatus === "PARTIALLY_RESOLVED" && (
                        <div className="mb-4">
                          <label className="block text-xs font-semibold text-gray-500 mb-1">
                            Technician Scheduled Date
                          </label>
                          <input
                            type="date"
                            value={actionDate}
                            onChange={(e) => setActionDate(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                          />
                        </div>
                      )}

                      {actionStatus === "DENIED" && (
                        <div className="mb-4">
                          <label className="block text-xs font-semibold text-gray-500 mb-1">
                            Reason for Denial
                          </label>
                          <textarea
                            rows={2}
                            value={actionDate}
                            onChange={(e) => setActionDate(e.target.value)}
                            placeholder="Explain why this request is denied..."
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none outline-none focus:border-red-500"
                          ></textarea>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateIssue(i)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-1.5 rounded transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setActioningIssue(null);
                            setActionDate("");
                          }}
                          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-bold px-4 py-1.5 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {i.status !== "PENDING" && (
                    <div className="flex flex-col text-xs text-gray-500 font-medium mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between w-full mb-1">
                        <span>Requested: {i.requestDate || "N/A"}</span>
                        <span>
                          {i.status === "PARTIALLY_RESOLVED"
                            ? `Technician Scheduled: ${i.scheduledDate}`
                            : `Scheduled: ${i.scheduledDate || "Not Scheduled"}`}
                        </span>
                      </div>
                      {i.status === "DENIED" && i.denyReason && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
                          <strong>Denial Reason:</strong> {i.denyReason}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
