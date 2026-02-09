import { useState } from "react";
import { NavLink } from "react-router-dom";

const Icon = ({ children }) => (
  <span className="w-5 h-5 shrink-0 text-white">{children}</span>
);

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuSections = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          ),
        },
        {
          label: "Courses",
          path: "/dashboard/courses",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h10" />
            </svg>
          ),
        },
        {
  label: "Sessions",
  path: "/dashboard/sessions",
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
},

        {
          label: "Analytics",
          path: "/dashboard/analytics",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="20" x2="12" y2="10" />
              <line x1="18" y1="20" x2="18" y2="4" />
              <line x1="6" y1="20" x2="6" y2="16" />
            </svg>
          ),
        },
        {
  label: "Messages",
  path: "/dashboard/messages",
  icon: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
},

      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className="relative z-40">
        <div
          className={`
            h-full bg-[#0C2B4E] border-r border-[#1A3D64]
            transition-all duration-300 overflow-y-auto
            w-0 md:w-64
            ${isOpen ? "w-64 fixed top-0 left-0 h-screen md:relative" : ""}
          `}
        >
          {/* Close button (mobile) */}
          <div className="flex items-center justify-end px-4 py-3 md:hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded hover:bg-[#1A3D64] text-white"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-3 py-4 space-y-4">
            {menuSections.map(({ title, items }) => (
              <div key={title}>
                <p className="hidden md:block px-3 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {title}
                </p>

                <div className="space-y-1">
                  {items.map(({ label, path, icon }) => (
                    <NavLink
                      key={label}
                      to={path}
                      end={path === "/dashboard"}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                          isActive
                            ? "bg-[#1D546C] text-white"
                            : "text-gray-200 hover:bg-[#1A3D64]"
                        }`
                      }
                    >
                      <Icon>{icon}</Icon>
                      <span className="text-sm font-medium flex-1 text-left">
                        {label}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
