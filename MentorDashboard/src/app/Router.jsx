import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

// Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/Analytics/Analytics.jsx";

function Router() {
  return (
    <Routes>
    
      <Route element={<DashboardLayout />}>
     
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

       
        <Route path="/dashboard" element={<Dashboard />} />

       
        <Route path="/dashboard/analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}

export default Router;
