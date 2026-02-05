import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const trendConfig = {
  up: {
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  down: {
    icon: TrendingDown,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  stable: {
    icon: Minus,
    color: "text-gray-500",
    bg: "bg-gray-100",
  },
};

export default function ProgressPulse({ items = [] }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Progress Pulse
      </h3>

      <div className="space-y-3">
        {items.map((item, index) => {
          const TrendIcon = trendConfig[item.trend].icon;

          return (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg px-4 py-3 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-2 ${trendConfig[item.trend].bg}`}
                >
                  <TrendIcon
                    className={`h-4 w-4 ${trendConfig[item.trend].color}`}
                  />
                </div>

                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </div>

              <span className="text-sm font-semibold text-gray-900">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
