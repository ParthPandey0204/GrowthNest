import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../store/AuthContext";

const notificationOptions = [
  {
    id: "session_reminders",
    title: "Session reminders",
    description: "Get nudges before each live session starts.",
  },
  {
    id: "support_messages",
    title: "Support messages",
    description: "Stay updated when cohort support threads and mentor inbox requests need attention.",
  },
  {
    id: "weekly_digest",
    title: "Weekly digest",
    description: "Receive a compact summary of engagement and course movement.",
  },
];

function Settings() {
  const { user, setUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const [toggles, setToggles] = useState({
    session_reminders: true,
    support_messages: true,
    weekly_digest: false,
  });

  function handleToggle(id) {
    setToggles((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant preview
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);

    setIsUploading(true);
    setUploadError("");
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/api/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      // Update user context with new avatar
      if (data.user) {
        setUser((prev) => ({ ...prev, avatar: data.user.avatar }));
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to upload avatar");
      setAvatarPreview(null); // Revert preview on failure
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };



  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_25%),linear-gradient(135deg,#0C2B4E,#1D546C)] px-6 py-7 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.28em] text-white/65">Profile & Settings</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Shape your mentor workspace</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              This page is frontend-only for now, which makes it a good place to practice form design, preference panels, and account UX before you wire backend persistence.
            </p>
          </div>
          <button className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0C2B4E] transition hover:bg-slate-100">
            Save Changes
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Public profile</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 space-y-3 mb-4">
              <span className="text-sm font-medium text-slate-700">Profile Picture</span>
              <div className="flex items-center gap-6">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" />
                  ) : user?.avatar ? (
                    <img src={user.avatar} alt="Current Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      <span className="text-white text-xs font-medium">{uploadProgress}%</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                  />
                  {uploadError && <p className="text-xs text-rose-600">{uploadError}</p>}
                </div>
              </div>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Display name</span>
              <input
                defaultValue={user?.name || "Parth Pandey"}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <input
                defaultValue="Mentor"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Bio</span>
              <textarea
                rows={4}
                defaultValue="Frontend-focused mentor building scalable cohort experiences through structured tasks, live sessions, and clear support systems."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Notification preferences</h2>
          <div className="mt-6 space-y-4">
            {notificationOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-100 bg-slate-50/70 px-4 py-4"
              >
                <div>
                  <p className="font-medium text-slate-900">{option.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(option.id)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    toggles[option.id] ? "bg-[#1D546C]" : "bg-slate-200"
                  }`}
                  aria-pressed={toggles[option.id]}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      toggles[option.id] ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;

