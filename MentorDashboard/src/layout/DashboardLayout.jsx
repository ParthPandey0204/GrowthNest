import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#F4F4F4]">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 bg-white ">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
