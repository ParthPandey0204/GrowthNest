import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubmission } from "../api/submissions.api";
import { myAssignmentsQueryKey } from "../services/assignment.service";

export default function SubmissionForm({ assignmentId, onSubmitted }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const submitMutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: myAssignmentsQueryKey }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !file) {
      setError("Please provide text content or upload a file.");
      return;
    }
    
    setError("");

    try {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      if (content) formData.append("content", content);
      if (file) formData.append("file", file);

      await submitMutation.mutateAsync(formData);
      
      setContent("");
      setFile(null);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit assignment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
      <h4 className="text-sm font-semibold text-slate-900 mb-3">Submit your work</h4>
      
      {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
      
      <div className="mb-4">
        <label htmlFor="content" className="block text-xs font-medium text-slate-700 mb-1">
          Submission Text
        </label>
        <textarea
          id="content"
          rows={4}
          className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-[#0C2B4E] focus:outline-none focus:ring-1 focus:ring-[#0C2B4E]"
          placeholder="Enter your submission or attach a link..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="file" className="block text-xs font-medium text-slate-700 mb-1">
          Attach File (PDF, ZIP)
        </label>
        <input
          type="file"
          id="file"
          accept=".pdf,.zip"
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button
        type="submit"
        disabled={submitMutation.isPending}
        className="px-4 py-2 bg-[#0C2B4E] text-white text-sm font-medium rounded-lg hover:bg-[#1D546C] disabled:opacity-50 transition-colors"
      >
        {submitMutation.isPending ? "Submitting..." : "Submit Assignment"}
      </button>
    </form>
  );
}
