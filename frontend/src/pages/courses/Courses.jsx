import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  BookOpenIcon,
  CheckCircleIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

import StatCard from "../../components/ui/StatCard";
import {
  useCreateCourse,
  useDeleteCourse,
  useInfiniteCourses,
} from "../../services/course.service";

/* ---------- Small UI Components ---------- */

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
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,#0C2B4E,#1D546C)] text-3xl text-white shadow-lg">
        +
      </div>

      <h3 className="text-xl font-semibold text-slate-900">
        No courses yet
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Start by creating your first course and begin mentoring learners.
      </p>

      <button className="mt-7 rounded-2xl bg-[linear-gradient(135deg,#0C2B4E,#1D546C)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-300/60 transition hover:-translate-y-0.5 hover:shadow-xl">
        + Create your first course
      </button>
    </div>
  );
}

function CourseSkeleton() {
  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/92 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="mb-5 h-6 w-40 animate-pulse rounded bg-slate-200" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="grid grid-cols-5 gap-4 border-t border-slate-100 py-5">
            <div className="col-span-2 h-5 animate-pulse rounded bg-slate-100" />
            <div className="h-5 animate-pulse rounded bg-slate-100" />
            <div className="h-5 animate-pulse rounded bg-slate-100" />
            <div className="h-5 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

function Courses() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteCourses();
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();
  const coursesData = useMemo(
    () => data?.pages.flatMap((page) => page.courses) ?? [],
    [data]
  );

  const handleCreateCourse = async (event) => {
    event.preventDefault();
    if (!newCourseTitle.trim()) return;

    await createCourse.mutateAsync({ title: newCourseTitle.trim() });
    setNewCourseTitle("");
    setIsCreateFormOpen(false);
  };

  /* Derived analytics (backend-ready) */
  const kpis = useMemo(() => {
    if (!coursesData.length)
      return [];

    return [
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
        value: coursesData.reduce(
          (sum, c) => sum + c.learners,
          0
        ),
        change: 18,
        trend: "up",
        icon: UsersIcon,
        color: "purple",
      },
      {
        title: "Avg Completion",
        value: `${Math.round(
          coursesData.reduce(
            (s, c) => s + c.avgProgress,
            0
          ) / coursesData.length
        )}%`,
        change: -4,
        trend: "down",
        icon: ChartBarIcon,
        color: "orange",
      },
    ];
  }, [coursesData]);

  /* ---------- Loading State ---------- */
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(244,182,61,0.18),_transparent_28%),linear-gradient(135deg,#ffffff,#f3f7fb)] px-6 py-7 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1D546C]/55">
              Course Studio
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Courses
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Manage your active cohorts, monitor learner momentum, and jump into detailed views built for mentor operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                Focus
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {coursesData.filter((course) => course.status === "active").length} active cohorts
              </p>
            </div>

            <button onClick={() => setIsCreateFormOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0C2B4E,#1D546C)] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-300/60 transition hover:-translate-y-0.5 hover:shadow-xl">
              + Create Course
            </button>
          </div>
        </div>
      </section>

      {isCreateFormOpen && (
        <form onSubmit={handleCreateCourse} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="sr-only" htmlFor="course-title">Course title</label>
          <input id="course-title" value={newCourseTitle} onChange={(event) => setNewCourseTitle(event.target.value)} placeholder="Course title" className="min-w-56 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" required />
          <button type="submit" disabled={createCourse.isPending} className="rounded-xl bg-[#1D546C] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
            {createCourse.isPending ? "Creating..." : "Create"}
          </button>
          <button type="button" onClick={() => setIsCreateFormOpen(false)} className="px-3 py-2 text-sm text-slate-600">Cancel</button>
          {createCourse.error && <p className="w-full text-sm text-rose-600">{createCourse.error.message || "Unable to create course."}</p>}
        </form>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {isLoading ? <CourseSkeleton /> : error ? (
        <div className="rounded-[30px] border border-rose-200 bg-rose-50 px-6 py-10 text-center shadow-sm">
          <p className="font-medium text-rose-800">Courses could not be loaded.</p>
          <p className="mt-1 text-sm text-rose-700">{error.message || "Please try again."}</p>
          <button onClick={() => refetch()} className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-sm font-medium text-white">Try again</button>
        </div>
      ) : coursesData.length === 0 ? (
        <div className="rounded-[30px] border border-slate-200/70 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <EmptyState />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/92 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Course roster
                </h2>
                <p className="text-sm text-slate-500">
                  Snapshot of enrollment, completion, and current status.
                </p>
              </div>

              <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {coursesData.length} total
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50/80 text-slate-500">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em]">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em]">
                    Learners
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em]">
                    Avg Progress
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.24em]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {coursesData.map((course) => (
                  <tr key={course.id} className="transition hover:bg-slate-50/80">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-slate-900">{course.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                          Course ID {course.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={course.status} />
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {course.learners}
                    </td>

                    <td className="px-6 py-5">
                      <ProgressBar value={course.avgProgress} />
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button onClick={() => deleteCourse.mutate(course.id)} disabled={deleteCourse.isPending} className="mr-3 text-sm font-medium text-rose-600 disabled:opacity-60">
                        Archive
                      </button>
                      <Link
                        to={`/dashboard/courses/${course.id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-[#1D546C] transition hover:border-[#1D546C] hover:bg-[#1D546C]/5"
                      >
                        Open
                        <span>&rsaquo;</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {hasNextPage && (
            <div className="border-t border-slate-100 p-4 text-center">
              <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60">
                {isFetchingNextPage ? "Loading..." : "Load more courses"}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Courses;
