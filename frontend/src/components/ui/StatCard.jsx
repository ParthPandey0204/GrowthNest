import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

function StatCard({
  title,
  value,
  change = 0,
  trend = "up",
  icon: IconComponent,
  color = "blue",
  onClick,
}) {
  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-700",
      green: "bg-green-50 text-green-700",
      purple: "bg-purple-50 text-purple-700",
      orange: "bg-orange-50 text-orange-700",
      indigo: "bg-indigo-50 text-indigo-700",
    };
    return colors[color] || colors.blue;
  };

  const formatChange = (val) =>
    `${val >= 0 ? "+" : ""}${val}%`;

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className={`relative rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,248,252,0.96))] p-6 pr-16 pt-7 pl-7 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)] ${
        onClick ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top,rgba(29,84,108,0.08),transparent_70%)]" />

      {/* Left accent */}
      <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#1D546C] rounded-full" />

      {/* Icon */}
      <div
        className={`
          absolute
          top-5
          right-5
          h-11
          w-11
          rounded-2xl
          flex
          items-center
          justify-center
          shadow-md
          ${getColorClasses(color)}
        `}
      >
        {IconComponent && <IconComponent className="h-5 w-5" />}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          {title}
        </p>

        <p className="text-3xl font-semibold tracking-tight text-slate-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>

        <div className="flex items-center gap-2">
          <span
            className={`
              rounded-full
              px-2.5
              py-1
              text-xs
              font-semibold
              ${
                trend === "up"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {formatChange(change)}
          </span>

          <ArrowTrendingUpIcon
            className={`h-4 w-4 ${
              trend === "up"
                ? "text-green-500"
                : "text-red-500 rotate-180"
            }`}
          />
          <span className="text-xs font-medium text-slate-400">
            vs last month
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
