const homeByRole = {
  ADMIN: "/admin/dashboard",
  STUDENT: "/student/dashboard",
  MENTOR: "/dashboard",
};

export const getHomePath = (role) => homeByRole[role] ?? "/login";
