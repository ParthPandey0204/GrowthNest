import { useEffect, useState } from "react";
import {
  UsersIcon,
  PlayIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

import StatCard from "../components/Statcard";
import MentorSnapshot from "../components/MentorSnapshot";

function Dashboard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "Total Learners",
      value: 128,
      change: 12.5,
      trend: "up",
      icon: UsersIcon,
      color: "blue",
    },
    {
      title: "Active Courses",
      value: 6,
      change: 8.2,
      trend: "up",
      icon: PlayIcon,
      color: "purple",
    },
    {
      title: "Live Sessions",
      value: 14,
      change: -3.1,
      trend: "down",
      icon: ClockIcon,
      color: "orange",
    },
    {
      title: "Revenue",
      value: 42000,
      change: 18.9,
      trend: "up",
      icon: CurrencyDollarIcon,
      color: "green",
    },
  ];

  return (
    <div className="space-y-10">

      <div className="flex items-center justify-between  bg-[#1D546C] px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-white">
            Dashboard
          </h1>
          <p className="text-xs text-white/70">
            Home / Dashboard
          </p>
        </div>

        <div className="flex items-center gap-6 text-white">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium">
              {now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-xs text-white/70">
              {now.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold cursor-pointer">
            P
          </div>
        </div>
      </div>

<div className="relative pl-8 py-2 mb-10">
  {/* The Branding Accent: Blue-Green (#1D546C) */}
  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1D546C] rounded-full" />
  
  <div className="flex flex-col gap-1">
    <h2 className="text-3xl font-extrabold tracking-tight text-[#0C2B4E]">
      Welcome back, <span className="text-[#1A3D64]">Mentor</span>
    </h2>

  </div>

  <div className="mt-3 flex items-center gap-2">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
    <span className="text-[11px] font-bold uppercase tracking-widest text-[#0C2B4E]/50">
      System Live • Analytics Synchronized
    </span>
  </div>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>


      <MentorSnapshot />
    </div>
  );
}

export default Dashboard;


