import {
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

function MentorSnapshot() {
  const metrics = [
    {
      label: "Learner Engagement",
      value: "82%",
      hint: "Active this week",
      icon: UsersIcon,
    },
    {
      label: "Session Completion",
      value: "91%",
      hint: "Last 30 days",
      icon: ClockIcon,
    },
    {
      label: "Average Course Rating",
      value: "4.7",
      hint: "Across all courses",
      icon: StarIcon,
    },
  ];

  return (
    <div
      className="
        relative
        rounded-2xl
        bg-white
        p-6
        pl-7
        shadow-sm
      "
    >
      {/* Vertical Accent Line */}
      <div className="absolute left-0 top-4 bottom-4 w-0.75 bg-[#1D546C] rounded-full" />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Mentor Performance Snapshot
        </h3>
        <span className="text-xs text-gray-400">
          Last 30 days
        </span>
      </div>

      <p className="mt-1 text-sm text-gray-500">
        A high-level view of how your mentorship is performing.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <item.icon className="h-5 w-5 text-gray-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {item.label}
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-400">
              {item.hint}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MentorSnapshot;
