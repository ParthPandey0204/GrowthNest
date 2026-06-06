import {
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

import mentorSnapshotData from "../../data/dashboard/MentorsnapshotData";

function MentorSnapshot() {
  const fallbackMetrics = [
    {
      id: "engagement",
      label: "Learner Engagement",
      value: "82%",
      hint: "Active this week",
      icon: UsersIcon,
    },
    {
      id: "completion",
      label: "Session Completion",
      value: "91%",
      hint: "Last 30 days",
      icon: ClockIcon,
    },
    {
      id: "rating",
      label: "Average Course Rating",
      value: "4.7",
      hint: "Across all courses",
      icon: StarIcon,
    },
  ];

  // Normalize data safely
  let metrics = fallbackMetrics;

  if (Array.isArray(mentorSnapshotData)) {
    metrics = mentorSnapshotData;
  } else if (
    mentorSnapshotData &&
    typeof mentorSnapshotData === "object"
  ) {
    metrics = Object.entries(mentorSnapshotData).map(
      ([key, value], index) => ({
        id: key,
        label:
          typeof value === "object" && value !== null
            ? value.label ?? key
            : key,
        value:
          typeof value === "object" && value !== null
            ? value.value ?? "--"
            : value,
        hint:
          typeof value === "object" && value !== null
            ? value.hint ?? ""
            : "",
        icon:
          typeof value === "object" && value !== null && value.icon
            ? value.icon
            : fallbackMetrics[index]?.icon ?? UsersIcon,
      })
    );
  }

  return (
    <div className="relative rounded-2xl bg-white p-6 pl-7 shadow-sm">
      
      <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#1D546C] rounded-full" />

   
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Mentor Performance Snapshot
        </h3>
        <span className="text-xs text-gray-400">Last 30 days</span>
      </div>

      <p className="mt-1 text-sm text-gray-500">
        A high-level view of how your mentorship is performing.
      </p>

     
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const IconComponent = metric.icon ?? UsersIcon;

          return (
          <div
            key={metric.id}
            className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <IconComponent className="h-5 w-5 text-gray-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">{metric.label}</p>
                <p className="text-xl font-semibold text-gray-900">
                  {metric.value}
                </p>
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-400">{metric.hint}</p>
          </div>
          );
        })}
      </div>
    </div>
  );
}

export default MentorSnapshot;
