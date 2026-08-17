import { useState, useRef } from "react";
import api from "../api/axios";

export default function CreateLessonForm({ programId, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("VIDEO");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
      } else {
        setError("Only video files are supported for drag and drop");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "VIDEO" && !file) {
      setError("Please select a video file.");
      return;
    }
    
    setError("");
    setProgress(0);
    setIsSubmitting(true);

    try {
      // Create lesson first
      const { data } = await api.post(`/api/programs/${programId}/lessons`, {
        title,
        description,
        type,
      });

      const lessonId = data.lesson.id;

      // Upload video if applicable
      if (type === "VIDEO" && file) {
        const formData = new FormData();
        formData.append("lessonId", lessonId);
        formData.append("file", file);

        await api.post("/api/upload/video", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        });
      }
      
      setTitle("");
      setDescription("");
      setFile(null);
      setProgress(0);
      setIsSubmitting(false);
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create lesson.");
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Lesson</h3>
      
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200">{error}</div>}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            type="text"
            required
            className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-[#0C2B4E] focus:outline-none focus:ring-1 focus:ring-[#0C2B4E]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-[#0C2B4E] focus:outline-none focus:ring-1 focus:ring-[#0C2B4E]"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="VIDEO">Video</option>
            <option value="ARTICLE">Article</option>
            <option value="ASSIGNMENT">Assignment</option>
          </select>
        </div>

        {type === "VIDEO" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Video File</label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragging ? "border-[#0C2B4E] bg-sky-50" : "border-slate-300 hover:bg-slate-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center">
                <svg className="w-8 h-8 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {file ? (
                  <p className="text-sm font-medium text-slate-700">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">MP4, WebM, OGG up to 500MB</p>
                  </>
                )}
              </div>
            </div>

            {isSubmitting && progress > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Uploading video...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-[#0C2B4E] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-[#0C2B4E] text-white text-sm font-medium rounded-lg hover:bg-[#1D546C] disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving..." : "Create Lesson"}
        </button>
      </div>
    </form>
  );
}
