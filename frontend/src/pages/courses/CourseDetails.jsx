import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  useMyCourse,
  useUpdateCourse,
  useDeleteLesson,
} from "../../services/course.service";
import CreateLessonForm from "../../components/CreateLessonForm";
import { getCourseEnrollments } from "../../api/courses.api";
import { useQuery } from "@tanstack/react-query";

/* ─── Small helpers ────────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const isDraft = status !== "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isDraft
          ? "bg-amber-100 text-amber-800"
          : "bg-emerald-100 text-emerald-800"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isDraft ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />
      {isDraft ? "Draft" : "Published"}
    </span>
  );
}

function KindChip({ kind }) {
  const styles = {
    video: "bg-sky-100 text-sky-800",
    article: "bg-emerald-100 text-emerald-800",
    assignment: "bg-amber-100 text-amber-800",
    live: "bg-purple-100 text-purple-800",
  };
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-semibold capitalize ${
        styles[kind] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {kind}
    </span>
  );
}

function SectionCard({ title, description, children, action }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function EmptySlate({ text }) {
  return (
    <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
      {text}
    </p>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */

export default function CourseDetails() {
  const { courseId } = useParams();

  /* Data */
  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useMyCourse(courseId);

  const updateCourse = useUpdateCourse();
  const deleteLesson = useDeleteLesson();

  /* Enrollments (load lazily when tab is clicked) */
  const [showEnrollments, setShowEnrollments] = useState(false);
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["enrollments", courseId],
    queryFn: () => getCourseEnrollments(courseId),
    enabled: showEnrollments,
  });
  const enrollments = enrollmentsData?.enrollments ?? [];

  /* Curriculum builder */
  const [isLessonFormOpen, setIsLessonFormOpen] = useState(false);

  /* Inline edit */
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", price: "" });

  /* Organised curriculum */
  const curriculum = useMemo(() => {
    const topics = new Map();
    const add = (topicName, item) => {
      const key = topicName?.trim() || "Getting started";
      if (!topics.has(key)) topics.set(key, []);
      topics.get(key).push(item);
    };
    course?.lessons?.forEach((lesson) =>
      add(lesson.topic, { ...lesson, kind: lesson.type.toLowerCase() })
    );
    course?.assignments?.forEach((assignment) =>
      add(assignment.topic, { ...assignment, kind: "assignment" })
    );
    return [...topics.entries()];
  }, [course]);

  /* Learner summary from enrollments */
  const learnerSummary = useMemo(() => {
    const total = enrollments.length;
    const completed = enrollments.filter((e) => e.progress === 100).length;
    const inProgress = enrollments.filter(
      (e) => e.progress > 0 && e.progress < 100
    ).length;
    const notStarted = enrollments.filter((e) => e.progress === 0).length;
    return { total, completed, inProgress, notStarted };
  }, [enrollments]);

  /* Handlers */
  const handlePublishToggle = () => {
    const newStatus = course.status === "active" ? "DRAFT" : "ACTIVE";
    updateCourse.mutate(
      { id: courseId, payload: { status: newStatus } },
      { onSuccess: refetch }
    );
  };

  const handleEditOpen = () => {
    setEditForm({
      title: course.title ?? "",
      description: course.description ?? "",
      price: course.price != null ? String(course.price) : "",
    });
    setIsEditing(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    updateCourse.mutate(
      {
        id: courseId,
        payload: {
          title: editForm.title.trim(),
          description: editForm.description.trim() || null,
          price: editForm.price === "" ? null : Number(editForm.price),
        },
      },
      {
        onSuccess: () => {
          refetch();
          setIsEditing(false);
        },
      }
    );
  };

  const handleDeleteLesson = (lessonId) => {
    if (!window.confirm("Remove this lesson from the course?")) return;
    deleteLesson.mutate(
      { programId: courseId, lessonId },
      { onSuccess: refetch }
    );
  };

  /* ─── States ──────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-52 animate-pulse rounded-3xl bg-slate-200" />
        <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="font-semibold text-rose-800">
          This course could not be loaded.
        </p>
        <p className="mt-1 text-sm text-rose-700">
          {error?.message || "Make sure you are the course owner."}
        </p>
        <Link
          to="/dashboard/courses"
          className="mt-4 inline-block rounded-xl bg-rose-700 px-4 py-2 text-sm font-medium text-white"
        >
          ← Back to courses
        </Link>
      </div>
    );
  }

  const isPublished = course.status === "active";
  const totalItems =
    (course.lessons?.length ?? 0) + (course.assignments?.length ?? 0);

  return (
    <div className="space-y-8">
      {/* ── Header banner ── */}
      <section className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#0C2B4E,#1D546C)] px-7 py-8 text-white shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link
              to="/dashboard/courses"
              className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/70 transition hover:text-sky-200"
            >
              ← Course Studio
            </Link>

            {isEditing ? (
              <form onSubmit={handleEditSave} className="mt-3 space-y-3">
                <input
                  autoFocus
                  required
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xl font-semibold text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Course title"
                />
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Short description (optional)"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, price: e.target.value }))
                    }
                    className="w-32 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Price (₹)"
                  />
                  <button
                    type="submit"
                    disabled={updateCourse.isPending}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0C2B4E] disabled:opacity-60"
                  >
                    {updateCourse.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {course.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-sky-50/80">
                  {course.description ||
                    "No description yet. Add one to help learners understand what this course covers."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <StatusBadge status={course.status} />
                  <span className="text-sm font-semibold">
                    {course.price ? `₹${course.price}` : "Free"}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                    {totalItems} curriculum item{totalItems !== 1 ? "s" : ""}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Action buttons */}
          {!isEditing && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleEditOpen}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                ✏️ Edit details
              </button>
              <button
                onClick={handlePublishToggle}
                disabled={updateCourse.isPending}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                  isPublished
                    ? "border border-white/20 text-white hover:bg-white/10"
                    : "bg-white text-[#0C2B4E] hover:bg-white/90"
                }`}
              >
                {updateCourse.isPending
                  ? "Saving..."
                  : isPublished
                  ? "Unpublish"
                  : "🚀 Publish course"}
              </button>
            </div>
          )}
        </div>

        {updateCourse.error && (
          <p className="mt-3 text-sm text-rose-200">
            {updateCourse.error.message || "Unable to update course."}
          </p>
        )}

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Curriculum items",
              value: totalItems,
            },
            {
              label: "Topics",
              value: curriculum.length,
            },
            {
              label: "Lessons",
              value: course.lessons?.length ?? 0,
            },
            {
              label: "Assignments",
              value: course.assignments?.length ?? 0,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">
                {stat.label}
              </p>
              <p className="mt-1 text-xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main layout ── */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        {/* Left: Curriculum builder */}
        <div className="space-y-5">
          <SectionCard
            title="Curriculum"
            description="Organize lessons and assignments into topics. Students see this structured view."
            action={
              <button
                onClick={() => setIsLessonFormOpen((o) => !o)}
                className="shrink-0 rounded-xl bg-[#0C2B4E] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1D546C]"
              >
                {isLessonFormOpen ? "✕ Close" : "+ Add item"}
              </button>
            }
          >
            {isLessonFormOpen && (
              <div className="mb-5">
                <CreateLessonForm
                  programId={courseId}
                  topics={curriculum.map(([topic]) => topic)}
                  onCreated={() => {
                    setIsLessonFormOpen(false);
                    refetch();
                  }}
                />
              </div>
            )}

            {curriculum.length === 0 ? (
              <EmptySlate text="No content yet. Click '+ Add item' to start building your curriculum." />
            ) : (
              <div className="space-y-4">
                {curriculum.map(([topic, items], topicIdx) => (
                  <div
                    key={topic}
                    className="overflow-hidden rounded-2xl border border-slate-200"
                  >
                    {/* Topic header */}
                    <div className="bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#1D546C]">
                        Topic {topicIdx + 1} · {items.length} item
                        {items.length !== 1 ? "s" : ""}
                      </p>
                      <h3 className="mt-0.5 font-semibold text-slate-900">
                        {topic}
                      </h3>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-slate-100">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-slate-50/70"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <KindChip kind={item.kind} />
                            <span className="truncate font-medium text-slate-800">
                              {item.title}
                            </span>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            {item.kind !== "assignment" && (
                              <Link
                                to={`/programs/${courseId}/lessons/${item.id}`}
                                className="text-xs font-medium text-[#1D546C] hover:underline"
                              >
                                Preview →
                              </Link>
                            )}
                            {item.kind !== "assignment" && (
                              <button
                                onClick={() => handleDeleteLesson(item.id)}
                                disabled={deleteLesson.isPending}
                                className="text-xs font-medium text-rose-500 hover:text-rose-700 disabled:opacity-50"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-5">
          {/* Publish guide */}
          <SectionCard title="Publishing checklist">
            <ul className="space-y-2 text-sm">
              {[
                {
                  done: Boolean(course.title),
                  text: "Course has a title",
                },
                {
                  done: Boolean(course.description),
                  text: "Description added",
                },
                {
                  done: (course.lessons?.length ?? 0) > 0,
                  text: "At least one lesson added",
                },
                {
                  done: isPublished,
                  text: "Course is published",
                },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                      item.done
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {item.done ? "✓" : "○"}
                  </span>
                  <span
                    className={
                      item.done ? "text-slate-700" : "text-slate-400"
                    }
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            {!isPublished && (
              <button
                onClick={handlePublishToggle}
                disabled={updateCourse.isPending || (course.lessons?.length ?? 0) === 0}
                className="mt-5 w-full rounded-xl bg-[#0C2B4E] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D546C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateCourse.isPending ? "Publishing..." : "🚀 Publish course"}
              </button>
            )}
            {!isPublished && (course.lessons?.length ?? 0) === 0 && (
              <p className="mt-2 text-center text-xs text-slate-400">
                Add at least one lesson before publishing.
              </p>
            )}
          </SectionCard>

          {/* Enrollments */}
          <SectionCard
            title="Enrolled learners"
            description={
              isPublished
                ? "Learners who have enrolled in this course."
                : "Enrolments open after you publish."
            }
            action={
              isPublished && !showEnrollments ? (
                <button
                  onClick={() => setShowEnrollments(true)}
                  className="text-sm font-medium text-[#1D546C] hover:underline"
                >
                  Load
                </button>
              ) : null
            }
          >
            {!showEnrollments ? (
              <EmptySlate
                text={
                  isPublished
                    ? "Click 'Load' to see enrolled learners."
                    : "Publish the course to start accepting learners."
                }
              />
            ) : enrollmentsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : enrollments.length === 0 ? (
              <EmptySlate text="No learners enrolled yet. Share the course link!" />
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    {
                      label: "Total",
                      value: learnerSummary.total,
                      tone: "bg-slate-50",
                    },
                    {
                      label: "In progress",
                      value: learnerSummary.inProgress,
                      tone: "bg-sky-50",
                    },
                    {
                      label: "Completed",
                      value: learnerSummary.completed,
                      tone: "bg-emerald-50",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`rounded-xl px-2 py-3 ${s.tone}`}
                    >
                      <p className="text-lg font-bold text-slate-900">
                        {s.value}
                      </p>
                      <p className="text-[11px] text-slate-500">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {enrollment.user?.name ?? "Learner"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {enrollment.user?.email ?? ""}
                        </p>
                      </div>
                      <div className="ml-3 shrink-0 text-right">
                        <p className="text-sm font-semibold text-slate-900">
                          {enrollment.progress}%
                        </p>
                        <p className="text-[10px] text-slate-400">progress</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          {/* Mentor tip */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Mentor tip
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Group lessons into meaningful topics so learners can navigate the
              course easily. Publish once you have at least one complete lesson
              ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
