import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

// Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/Analytics/Analytics";
import Courses from "../pages/Courses/Courses";
import Messages from "../pages/Messages/Messages";
import Sessions from "../pages/Sessions/Sessions";




function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/courses" element={<Courses />} />
        <Route path="/dashboard/messages" element={<Messages />} />      
        <Route path="/dashboard/sessions" element={<Sessions />} />
      </Route>
    </Routes>
  );
}

export default App;
