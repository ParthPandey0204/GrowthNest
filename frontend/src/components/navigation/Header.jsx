import { useAuth } from "../../store/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };
  const displayName = user?.name || "GrowthNest User";
  const firstName = displayName.trim().split(/\s+/)[0];
  const displayRole = user?.role || "Member";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[linear-gradient(135deg,#081c35,#0f3259_58%,#184c77)] shadow-[0_18px_40px_rgba(8,28,53,0.18)] backdrop-blur">
      <div className="flex w-full items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/12 md:hidden"
            aria-label="Open navigation menu"
          >
            <span className="text-2xl leading-none">&#9776;</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f4b63d,#ffd978)] text-sm font-black uppercase tracking-[0.18em] text-slate-950 shadow-lg shadow-amber-200/20">
              GN
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.28em] text-sky-100/65">
                Mentor OS
              </p>
              <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
                GrowthNest
              </h1>
            </div>
          </div>
        </div>

        <form
          role="search"
          className="hidden flex-1 items-center sm:flex"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="ml-4 mr-2 flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 shadow-inner shadow-slate-950/10 backdrop-blur">
            <span className="text-sm text-sky-100/70">&#128269;</span>
            <input
              type="search"
              placeholder="Search courses, learners, or sessions"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-sky-100/55"
            />
            <button
              type="submit"
              className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/15"
            >
              Search
            </button>
          </div>
        </form>

        <button
          type="button"
          className="ml-auto rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/12 sm:hidden"
          aria-label="Search"
        >
          <span className="text-lg">&#128269;</span>
        </button>

        <div className="hidden items-center gap-3 sm:flex">
          <button
            type="button"
            className="rounded-2xl bg-[linear-gradient(135deg,#f4b63d,#ffdf8f)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-amber-200/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Schedule Session
          </button>

          <button
            type="button"
            className="relative rounded-2xl border border-white/10 bg-white/6 p-2.5 text-white transition hover:bg-white/12"
            aria-label="Notifications"
          >
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-[#0f3259]" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
              <path d="M10 19a2 2 0 0 0 4 0" />
            </svg>
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-white backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-sm font-semibold">
              {firstName.charAt(0)}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-[11px] uppercase tracking-wide text-sky-100/70">
                {displayRole}
              </p>
            </div>
            <button type="button" onClick={handleLogout} className="border-l border-white/15 pl-3 text-xs font-semibold text-sky-100 hover:text-white">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
