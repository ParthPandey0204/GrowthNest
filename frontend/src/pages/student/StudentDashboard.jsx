import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyEnrollments } from "../../services/enrollment.service";
import { useMyAssignments } from "../../services/assignment.service";
import SubmissionForm from "../../components/SubmissionForm";

function StudentDashboard() {
  const { data: enrollments = [], isLoading: isLoadingEnrollments, error: enrollmentsError } = useMyEnrollments();
  const { data: assignments = [], isLoading: isLoadingAssignments, refetch: refetchAssignments } = useMyAssignments();
  
  const [activeTab, setActiveTab] = useState('courses');
  
  if (isLoadingEnrollments || isLoadingAssignments) return <div className="grid gap-5 sm:grid-cols-2">{[1, 2].map((item) => <div key={item} className="h-48 animate-pulse rounded-3xl bg-slate-200" />)}</div>;
  if (enrollmentsError) return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">Unable to load your learning dashboard.</div>;
  
  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1D546C]">Student dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">My Learning</h1>
        <p className="mt-2 text-sm text-slate-600">Pick up where you left off and keep your progress moving.</p>
      </section>

      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('courses')}
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'courses' ? 'text-[#0C2B4E] border-b-2 border-[#0C2B4E]' : 'text-slate-500 hover:text-slate-700'}`}
        >
          My Courses
        </button>
        <button 
          onClick={() => setActiveTab('assignments')}
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'assignments' ? 'text-[#0C2B4E] border-b-2 border-[#0C2B4E]' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Assignments
        </button>
      </div>

      {activeTab === 'courses' && (
        enrollments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-600">You have not enrolled in a program yet.</p>
            <Link to="/programs" className="mt-4 inline-block rounded-xl bg-[#1D546C] px-4 py-2 text-sm font-medium text-white">Browse programs</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {enrollments.map((enrollment) => (
              <article key={enrollment.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1D546C]">{enrollment.program?.mentor?.name ?? "GrowthNest"}</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{enrollment.program?.title ?? "New program"}</h2>
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Progress</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-[#1D546C]" style={{ width: `${enrollment.progress}%` }} />
                  </div>
                </div>
                <Link to={`/programs/${enrollment.programId}`} className="mt-6 inline-block text-sm font-semibold text-[#1D546C]">Continue learning →</Link>
              </article>
            ))}
          </div>
        )
      )}

      {activeTab === 'assignments' && (
        assignments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-600">You have no pending assignments.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {assignments.map((assignment) => {
              const submission = assignment.submissions?.[0];
              return (
                <div key={assignment.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-medium text-[#1D546C] bg-sky-50 px-2 py-1 rounded-md">{assignment.program?.title}</span>
                      <h3 className="text-xl font-semibold text-slate-900 mt-2">{assignment.title}</h3>
                    </div>
                    {submission ? (
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        submission.status === 'REVIEWED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {submission.status === 'REVIEWED' ? `Graded: ${submission.grade ?? '—'}/100` : 'Submitted'}
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">Pending</span>
                    )}
                  </div>
                  
                  {assignment.dueAt && (
                    <p className="text-sm text-slate-500 mb-4">Due: {new Date(assignment.dueAt).toLocaleDateString()}</p>
                  )}
                  
                  {!submission && (
                    <SubmissionForm 
                      assignmentId={assignment.id} 
                      onSubmitted={() => refetchAssignments()} 
                    />
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

export default StudentDashboard;
