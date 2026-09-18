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

function PrivateRoute({ children }: any) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
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
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/:propertyId" element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:propertyId" element={<PropertyDetails />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="employees" element={<Employees />} />
        </Route>
        <Route
          path="/portal"
          element={
            <PrivateRoute>
              <TenantPortal />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
