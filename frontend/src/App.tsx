import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Properties from "./components/Properties";
import Employees from "./components/Employees";
import PropertyDetails from "./components/PropertyDetails";
import PublicPortal from "./components/PublicPortal";
import PublicPropertyDetails from "./components/PublicPropertyDetails";
import Tenants from "./components/Tenants";
import TenantPortal from "./components/TenantPortal";
import { jwtDecode } from "jwt-decode";

type TokenClaims = {
  role?: string;
  exp?: number;
};

const STAFF_ROLES = ["ADMIN", "MANAGER", "EMPLOYEE"];

function getTokenRole(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: TokenClaims = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded.role || "USER";
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

function PrivateRoute({ children, allowedRoles }: any) {
  const role = getTokenRole();
  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles || allowedRoles.includes(role)) return children;

  if (role === "USER") return <Navigate to="/portal" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Facing */}
        <Route path="/" element={<PublicPortal />} />
        <Route path="/p/:propertyId" element={<PublicPropertyDetails />} />

        {/* Employee Login */}
        <Route path="/login" element={<Login />} />

        {/* Employee Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute allowedRoles={STAFF_ROLES}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/:propertyId" element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:propertyId" element={<PropertyDetails />} />
          <Route path="tenants" element={<Tenants />} />
          <Route
            path="employees"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <Employees />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="/portal"
          element={
            <PrivateRoute allowedRoles={["USER"]}>
              <TenantPortal />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
