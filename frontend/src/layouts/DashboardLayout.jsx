import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/Sidebar";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col bg-[linear-gradient(180deg,#f3f6fb_0%,#eef3f8_52%,#f8fafc_100%)] text-slate-900">
      {/* HEADER */}
      <Header onMenuToggle={() => setIsSidebarOpen((open) => !open)} />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
