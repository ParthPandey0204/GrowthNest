import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

// Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/analytics/Analytics";
import CourseDetails from "../pages/courses/CourseDetails";
import Courses from "../pages/courses/Courses";
import Messages from "../pages/messages/Messages";
import Sessions from "../pages/sessions/Sessions";




function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/courses" element={<Courses />} />
        <Route
          path="/dashboard/courses/:courseId"
          element={<CourseDetails />}
        />
        <Route path="/dashboard/messages" element={<Messages />} />      
        <Route path="/dashboard/sessions" element={<Sessions />} />
      </Route>
    </Routes>
  );
}

export default App;
