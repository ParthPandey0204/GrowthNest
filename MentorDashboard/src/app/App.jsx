import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

// pages
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Analytics from "../pages/Analytics/Analytics.jsx";

function App() {
  return (
    <Routes>
      {/* Persistent dashboard layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}

export default App;

