import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/student/dashboard": "My Learning",
  "/programs": "Programs",
  "/dashboard": "Mentor Dashboard",
  "/dashboard/courses": "Courses",
  "/dashboard/sessions": "Sessions",
  "/dashboard/messages": "Messages",
  "/dashboard/analytics": "Analytics",
  "/admin/dashboard": "Admin Dashboard",
  "/admin/users": "User Management",
  "/admin/programs": "Program Moderation",
};

export default function PageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const title = pageTitles[pathname] ?? "GrowthNest";
    document.title = `${title} | GrowthNest`;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = "GrowthNest connects learners with mentor-led programs, sessions, and progress tracking.";
  }, [pathname]);
  return null;
}
