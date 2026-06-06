import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getCourseById } from "../../services/course.service";
import contentItems from "../../data/content/ContentData";
import sessionsData from "../../data/sessions/SessionData";
import students from "../../data/students/StudentData";
import tasks from "../../data/tasks/TaskData";

const assetTone = {
  PDF: "bg-rose-50 text-rose-700",
  Video: "bg-sky-50 text-sky-700",
  Resource: "bg-emerald-50 text-emerald-700",
  Asset: "bg-amber-50 text-amber-700",
};

const riskTone = {
  "On Track": "bg-emerald-50 text-emerald-700",
  Ahead: "bg-sky-50 text-sky-700",
  "Needs Support": "bg-amber-50 text-amber-700",
  "At Risk": "bg-rose-50 text-rose-700",
};

function formatSessionDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    async function loadCourse() {
      const data = await getCourseById(courseId);
      setCourse(data);
    }

    loadCourse();
  }, [courseId]);

  const courseAssets = useMemo(
    () => contentItems.filter((item) => item.course === course?.title),
    [course]
  );
  const courseTasks = useMemo(
    () => tasks.filter((item) => item.course === course?.title),
    [course]
  );
  const courseSessions = useMemo(
    () => sessionsData.filter((item) => item.course === course?.title),
    [course]
  );
  const courseStudents = useMemo(
    () => students.filter((item) => item.track === course?.title),
    [course]
  );

  if (!course) {
    return (
      <div className="rounded-[32px] border border-dashed border-slate-200 bg-white/90 px-6 py-16 text-center text-sm text-slate-500 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
        Course details could not be found.
      </div>
    );
  }

  const deliveryStats = [
    { label: "Content assets", value: courseAssets.length },
    { label: "Assignments live", value: courseTasks.length },
    { label: "Sessions scheduled", value: courseSessions.length },
    { label: "Learners in flow", value: courseStudents.length || course.learners },
  ];

  const learnerSummary = courseStudents.reduce(
    (accumulator, student) => {
      if (student.status === "At Risk") accumulator.atRisk += 1;
      if (student.status === "Needs Support") accumulator.needsSupport += 1;
      if (student.status === "On Track" || student.status === "Ahead") {
        accumulator.onTrack += 1;
      }
      return accumulator;
    },
    { onTrack: 0, needsSupport: 0, atRisk: 0 }
  );

  const recentAnnouncements = [
    {
      id: "announce_1",
      title: "Publish weekly recap video",
      detail: "Bundle last live session recording with module notes and key takeaways.",
    },
    {
      id: "announce_2",
      title: "Broadcast assignment reminder",
      detail: "Target students with pending work 48 hours before the deadline.",
    },
    {
      id: "announce_3",
      title: "Prep live Q&A agenda",
      detail: "Use at-risk learner questions to shape the next session runbook.",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[34px] border border-slate-200/40 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(135deg,#0C2B4E,#1D546C)] px-6 py-7 text-white shadow-[0_22px_48px_rgba(12,43,78,0.24)]">
        <p className="text-xs uppercase tracking-[0.28em] text-white/65">
          Integrated Course Workspace
        </p>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80">
              Upload lesson videos, share notes, assign work, run live sessions, and monitor learner risk from one place. This page is the operating center for a mentor managing the full delivery loop at scale.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {deliveryStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur"
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
              {course.status === "active" ? "Active cohort" : "Draft mode"}
            </span>
            <Link
              to="/dashboard/courses"
              className="rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              Back to courses
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-4">
        {[
          {
            title: "1. Publish",
            body: "Upload a video, note, or starter resource to the right module.",
          },
          {
            title: "2. Assign",
            body: "Attach hands-on work so students move from watching to doing.",
          },
          {
            title: "3. Run live",
            body: "Use sessions to unblock common issues and drive completion forward.",
          },
          {
            title: "4. Intervene",
            body: "Use learner risk signals to follow up with the right students early.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-[28px] border border-slate-200/70 bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
          >
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{item.body}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-6">
          <section className="rounded-[30px] border border-slate-100 bg-white/92 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Content pipeline</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Recorded videos, notes, and reusable resources that support this course.
                </p>
              </div>
              <button className="rounded-full bg-[#1D546C] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#174658]">
                + Upload lesson
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              {courseAssets.length > 0 ? (
                courseAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="rounded-[24px] border border-slate-100 bg-slate-50/80 px-4 py-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{asset.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {asset.updatedAt} - {asset.size} - {asset.usage}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${assetTone[asset.type]}`}>
                        {asset.type}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
                  No course assets yet. Start by uploading an intro lesson, summary notes, or a reusable resource pack.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-100 bg-white/92 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Assignments and practice</h2>
                <p className="mt-1 text-sm text-slate-500">
                  The work students must complete after content consumption.
                </p>
              </div>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Link assignment
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              {courseTasks.length > 0 ? (
                courseTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-[24px] border border-slate-100 bg-slate-50/80 px-4 py-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{task.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Deadline {task.deadline} - {task.submissions} submitted - {task.reviewed} reviewed
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                          {task.status}
                        </span>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
                  No assignments linked yet. Pair each lesson with a concrete practice task to keep completion moving.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-100 bg-white/92 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Live sessions</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Scheduled sessions, Q&A blocks, and the interaction layer for this cohort.
                </p>
              </div>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Schedule live session
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              {courseSessions.length > 0 ? (
                courseSessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-[24px] border border-slate-100 bg-slate-50/80 px-4 py-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{session.topic}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatSessionDate(session.datetime)} - {session.durationMin} min - {session.attendees} attendees
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        session.status === "upcoming"
                          ? "bg-sky-50 text-sky-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
                  No live sessions scheduled yet. Add office hours or guided review blocks to support this course.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[30px] border border-slate-100 bg-white/92 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <h2 className="text-lg font-semibold text-slate-900">Learner operations</h2>
            <p className="mt-1 text-sm text-slate-500">
              Track who is on pace, who needs intervention, and where mentor time should go first.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                { label: "On track", value: learnerSummary.onTrack, tone: "bg-emerald-50 text-emerald-700" },
                { label: "Needs support", value: learnerSummary.needsSupport, tone: "bg-amber-50 text-amber-700" },
                { label: "At risk", value: learnerSummary.atRisk, tone: "bg-rose-50 text-rose-700" },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                      priority
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {courseStudents.length > 0 ? (
                courseStudents.map((student) => (
                  <div
                    key={student.id}
                    className="rounded-[22px] border border-slate-100 bg-white px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {student.progress}% progress - last seen {student.lastSeen}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskTone[student.status]}`}>
                        {student.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
                  No learner roster has been linked to this course yet.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-100 bg-white/92 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <h2 className="text-lg font-semibold text-slate-900">Mentor broadcast queue</h2>
            <p className="mt-1 text-sm text-slate-500">
              The communication layer that connects uploads, assignments, and live support.
            </p>

            <div className="mt-5 space-y-3">
              {recentAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-4"
                >
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-100 bg-white/92 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <h2 className="text-lg font-semibold text-slate-900">Command summary</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>
                Every course needs one clear delivery loop: publish the lesson, attach the practice, run the live support, then review learner risk.
              </p>
              <p>
                This workspace is now organized around that loop so a mentor can manage thousands of students without jumping across disconnected tools.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default CourseDetails;
