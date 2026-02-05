import { Outlet } from "react-router-dom";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/Sidebar";

function DashboardLayout() {
  return (
    <div className="h-screen w-full bg-[#F4F4F4] flex flex-col">
      {/* HEADER */}
      <Header />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-white px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
