import { useEffect, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import MentorSnapshot from "./MentorSnapshot";
import ProgressPulse from "../../components/ui/ProgressPulse";
import GrowthInsight from "../../components/ui/GrowthInsight";
import stats from "../../data/dashboard/StatsData";
import { progressPulseData } from "../../data/dashboard/ProgressPulseData";
import StatCard from "../../components/ui/StatCard.jsx";

function Dashboard() {
  const [now, setNow] = useState(new Date());
  const { user } = useAuth();
  const displayName = user?.name || "GrowthNest User";
  const growthInsightData = {
  insight:
    "Learners who attended 2 or more live sessions completed assignments 37% faster than others.",
  timeframe: "the last 30 days",
};


  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const firstName = displayName.trim().split(/\s+/)[0];

  return (
    <div className="space-y-10">
      
      <div className="flex items-center justify-between bg-[#1D546C] px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          <p className="text-xs text-white/70">Home / Dashboard</p>
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
            {displayName.charAt(0)}
          </div>
        </div>
      </div>

    
      <div className="relative pl-8 py-2 mb-10">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1D546C] rounded-full" />

        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0C2B4E]">
            Welcome back,{" "}
            <span className="text-[#1A3D64]">{firstName}</span>
          </h2>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#0C2B4E]/50">
            System Live / Analytics Synchronized
          </span>
        </div>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

     
  
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <ProgressPulse items={progressPulseData} />

     <GrowthInsight
    insight={growthInsightData.insight}
    timeframe={growthInsightData.timeframe}
     />
    </div>

     <MentorSnapshot />

    </div>
  );
}

export default Dashboard;
