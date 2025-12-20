import { useEffect, useState } from "react";

function Dashboard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        relative
        w-full
        h-[68px]
        bg-[#1D546C]
        bg-gradient-to-r from-white/5 to-transparent
        flex
        items-center
        justify-between
        px-6
        border-b border-black/10
      "
    >
      {/* Left */}
      <div className="flex flex-col leading-tight">
        <h1 className="text-lg font-semibold text-white tracking-wide">
          Dashboard
        </h1>
        <span className="text-xs text-white/70">
          Home / Dashboard
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5 text-white">
        {/* Date & Time */}
        <div className="hidden sm:flex flex-col items-end leading-tight">
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

        {/* Notification */}
        <svg
          className="w-5 h-5 text-white/80 hover:text-white cursor-pointer"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold cursor-pointer">
          P
        </div>
      </div>

      {/* Active underline */}
      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-white/30" />
    </div>
  );
}

export default Dashboard;

