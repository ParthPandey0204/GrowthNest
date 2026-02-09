import {
  BookOpenIcon,
  CheckCircleIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

import StatCard from "../../components/ui/StatCard";
import coursesData from "../../data/Courses/CourseData";

/* ---------- Helpers ---------- */

function StatusBadge({ status }) {
  const styles =
    status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-600";

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles}`}>
      {status === "active" ? "Active" : "Draft"}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="w-32">
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-[#1D546C]"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">{value}%</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-4xl">📘</div>
      <h3 className="text-lg font-semibold text-gray-900">
        No courses yet
      </h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">
        Start by creating your first course and begin mentoring learners.
      </p>

      <button className="mt-6 rounded-lg bg-[#0C2B4E] px-5 py-2 text-sm font-medium text-white hover:bg-[#143D6B] transition">
        + Create your first course
      </button>
    </div>
  );
}

/* ---------- Page ---------- */

function Courses() {
  const kpis = [
    {
      title: "Total Courses",
      value: coursesData.length,
      change: 12,
      trend: "up",
      icon: BookOpenIcon,
      color: "blue",
    },
    {
      title: "Active Courses",
      value: coursesData.filter(c => c.status === "active").length,
      change: 8,
      trend: "up",
      icon: CheckCircleIcon,
      color: "green",
    },
    {
      title: "Total Learners",
      value: coursesData.reduce((sum, c) => sum + c.learners, 0),
      change: 18,
      trend: "up",
      icon: UsersIcon,
      color: "purple",
    },
    {
      title: "Avg Completion",
      value: `${Math.round(
        coursesData.reduce((s, c) => s + c.avgProgress, 0) /
          coursesData.length
      )}%`,
      change: -4,
      trend: "down",
      icon: ChartBarIcon,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Courses
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor your courses
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-[#0C2B4E] px-4 py-2 text-sm font-medium text-white hover:bg-[#143D6B] transition">
          + Create Course
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map(kpi => (
          <StatCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Courses Table / Empty State */}
      {coursesData.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white">
          <EmptyState />
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Course</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-left font-medium">Learners</th>
                <th className="px-6 py-4 text-left font-medium">
                  Avg Progress
                </th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {coursesData.map(course => (
                <tr
                  key={course.id}
                  className={`transition hover:bg-gray-50 ${
                    course.status === "draft" ? "bg-gray-50/50" : ""
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {course.title}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={course.status} />
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {course.learners}
                  </td>

                  <td className="px-6 py-4">
                    <ProgressBar value={course.avgProgress} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    {course.status === "draft" ? (
                      <button className="text-sm font-medium text-orange-600 hover:underline">
                        Edit
                      </button>
                    ) : (
                      <button className="text-sm font-medium text-[#1D546C] hover:underline">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Courses;
