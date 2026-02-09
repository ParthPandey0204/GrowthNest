import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

// Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/Analytics/Analytics.jsx";
import Courses from "../pages/Courses/Courses.jsx";

function Router() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/courses" element={<Courses />} />
      </Route>
    </Routes>
  );
}

export default Router;
