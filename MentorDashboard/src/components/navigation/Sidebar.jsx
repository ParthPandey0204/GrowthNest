import { useState } from "react";

const Icon = ({ children }) => (
  <span className="w-5 h-5 shrink-0 text-white">{children}</span>
);

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");


  const menuSections = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
        { label: "Analytics", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg> },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "My Learners", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4" /><path d="M17 11a4 4 0 1 0-8 0" /><path d="M3 21v-2a4 4 0 0 1 4-4h4" /></svg> },
        { label: "My Courses", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19h16" /><path d="M4 4h16v12H4z" /></svg> },
        { label: "Tasks", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg> },
        { label: "Sessions", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg> },
      ],
    },
    {
      title: "Communication",
      items: [
        { label: "Messages", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8A8.5 8.5 0 0 1 12 20a8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.2A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z" /></svg> },
      ],
    },
  ];

  const supportItems = [
    { label: "Help", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> },
    { label: "Settings", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
    { label: "Logout", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg> },
  ];

  return (
    <>
  
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className="fixed md:relative top-0 left-0 h-screen z-40">
        <div
          className={`
            h-full bg-[#0C2B4E] border-r border-[#1A3D64]
            transition-all duration-300 overflow-y-auto
            w-0 md:w-64
            ${isOpen ? "w-64" : ""}
          `}
        >

          <div className="flex items-center justify-end px-4 py-3 md:hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded hover:bg-[#1A3D64] text-white"
            >
              ✕
            </button>
          </div>

          <nav className="px-3 py-4 space-y-4">
            {menuSections.map(({ title, items }) => (
              <div key={title}>
                <p className="hidden md:block px-3 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {title}
                </p>
                <div className="space-y-1">
                  {items.map(({ label, icon }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setActive(label);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                        active === label
                          ? "bg-[#1D546C] text-white"
                          : "text-gray-200 hover:bg-[#1A3D64]"
                      }`}
                    >
                      <Icon>{icon}</Icon>
                      <span className="text-sm font-medium flex-1 text-left">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <nav className="px-3 py-4 border-t border-[#1A3D64] space-y-1">
            {supportItems.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActive(label);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                  active === label
                    ? "bg-[#1D546C] text-white"
                    : "text-gray-200 hover:bg-[#1A3D64]"
                }`}
              >
                <Icon>{icon}</Icon>
                <span className="text-sm font-medium flex-1 text-left">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

  {!isOpen && (
  <button
    onClick={() => setIsOpen(true)}
    className="
      fixed top-3.5 left-4 z-50
      p-3 sm:p-2
      rounded md:hidden
      bg-[#0C2B4E] text-white shadow-lg
      transition
    "
  >
    <span className="text-2xl sm:text-xl">☰</span>
  </button>
)}
    </>
  );
}

export default Sidebar;