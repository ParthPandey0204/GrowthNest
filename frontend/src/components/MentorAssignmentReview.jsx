import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssignmentSubmissions } from "../api/submissions.api";
import { reviewSubmission } from "../api/submissions.api";

export default function MentorAssignmentReview({ assignment }) {
  const client = useQueryClient();
  const [drafts, setDrafts] = useState({});
  const { data, isLoading } = useQuery({ queryKey: ["assignment-submissions", assignment.id], queryFn: () => getAssignmentSubmissions(assignment.id) });
  const mutation = useMutation({ mutationFn: ({ id, payload }) => reviewSubmission(id, payload), onSuccess: () => client.invalidateQueries({ queryKey: ["assignment-submissions", assignment.id] }) });
  return <details className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-medium">{assignment.title} · Review submissions</summary>
    {isLoading ? <p className="mt-3 text-sm text-slate-500">Loading submissions…</p> : data?.submissions?.length ? <div className="mt-3 space-y-3">{data.submissions.map((submission) => {
      const draft = drafts[submission.id] || { grade: submission.grade ?? "", feedback: submission.feedback ?? "" };
      return <article key={submission.id} className="rounded-lg bg-slate-50 p-3 text-sm"><div className="flex justify-between"><strong>{submission.user.name}</strong><span>{submission.status}</span></div>
        {submission.content && <p className="my-2 whitespace-pre-wrap">{submission.content}</p>}{submission.fileUrl && <p><a className="text-sky-700 underline" href={submission.fileUrl} target="_blank" rel="noreferrer">Open submitted file</a></p>}
        <div className="mt-3 grid gap-2 sm:grid-cols-[100px_1fr_auto]"><input aria-label="Grade" type="number" min="0" step="0.1" className="rounded border p-2" placeholder="Grade" value={draft.grade} onChange={(e) => setDrafts((all) => ({ ...all, [submission.id]: { ...draft, grade: e.target.value } }))}/><input aria-label="Feedback" className="rounded border p-2" placeholder="Feedback" value={draft.feedback} onChange={(e) => setDrafts((all) => ({ ...all, [submission.id]: { ...draft, feedback: e.target.value } }))}/><button className="rounded bg-[#0C2B4E] px-3 py-2 text-white" disabled={mutation.isPending} onClick={() => mutation.mutate({ id: submission.id, payload: { grade: Number(draft.grade), feedback: draft.feedback, status: "REVIEWED" } })}>Save review</button></div>
      </article>;
    })}</div> : <p className="mt-3 text-sm text-slate-500">No submissions yet.</p>}
    {mutation.isError && <p className="mt-2 text-sm text-rose-600">Could not save review.</p>}
  </details>;
}
