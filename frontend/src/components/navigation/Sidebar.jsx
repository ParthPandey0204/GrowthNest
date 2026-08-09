import { NavLink } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

const Icon = ({ children }) => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/6 text-white transition">
    <span className="h-5 w-5">{children}</span>
  </span>
);

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
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

  if (user?.role === "STUDENT") {
    menuSections[0].items = [
      { label: "My Learning", path: "/student/dashboard", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5.5 12 3l8 2.5v13L12 21l-8-2.5v-13Z" /><path d="M12 7v14" /></svg> },
      { label: "Browse Programs", path: "/programs", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h10" /></svg> },
    ];
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className="relative z-40">
        <div
          className={`
            h-full overflow-y-auto border-r border-white/8
            bg-[radial-gradient(circle_at_top,_rgba(45,122,179,0.18),_transparent_32%),linear-gradient(180deg,#081c35_0%,#0b2746_48%,#0d2f53_100%)]
            transition-all duration-300
            w-0 md:w-[18rem]
            ${isOpen ? "fixed left-0 top-0 h-screen w-[18rem] shadow-2xl shadow-slate-950/35 md:relative" : ""}
          `}
        >
          <div className="border-b border-white/8 px-4 py-4">
            <div className="flex items-center justify-between md:justify-start">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-sky-100/40">
                  Workspace
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  {user?.role === "STUDENT" ? "Learning Console" : "Mentor Console"}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-white transition hover:bg-white/12 md:hidden"
                aria-label="Close navigation menu"
              >
                Close
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-6 px-3 py-5">
            {menuSections.map(({ title, items }) => (
              <div key={title}>
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-100/40">
                  {title}
                </p>

                <div className="space-y-1">
                  {items.map(({ label, path, icon }) => (
                    <NavLink
                      key={label}
                      to={path}
                      end={path === "/dashboard"}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group flex w-full items-center gap-3 rounded-2xl px-3 py-3 transition ${
                          isActive
                            ? "bg-[linear-gradient(135deg,rgba(36,103,147,0.95),rgba(29,84,108,0.95))] text-white shadow-lg shadow-slate-950/20"
                            : "text-sky-50/82 hover:bg-white/8"
                        }`
                      }
                    >
                      <Icon>{icon}</Icon>
                      <span className="flex-1 text-left text-sm font-medium">
                        {label}
                      </span>
                      <span className="text-xs text-sky-100/35 transition group-hover:text-sky-100/55">
                        &rsaquo;
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
