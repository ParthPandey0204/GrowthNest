import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import UserManagement from "../pages/admin/UserManagement";

// Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/analytics/Analytics";
import CourseDetails from "../pages/courses/CourseDetails";
import Courses from "../pages/courses/Courses";
import Messages from "../pages/messages/Messages";
import Sessions from "../pages/sessions/Sessions";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Programs from "../pages/programs/Programs";
import ProgramDetails from "../pages/programs/ProgramDetails";
import LessonView from "../pages/programs/LessonView";
import StudentDashboard from "../pages/student/StudentDashboard";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
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
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:id" element={<ProgramDetails />} />
        <Route path="/programs/:id/lessons/:lessonId" element={<LessonView />} />
        <Route path="/student/dashboard" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
