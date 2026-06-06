import { useMemo, useState } from "react";
import contentItems from "../../data/content/ContentData";

function ContentManager() {
  const [filter, setFilter] = useState("All");

  const filteredItems = useMemo(() => {
    if (filter === "All") {
      return contentItems;
    }
    return contentItems.filter((item) => item.type === filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_24%),linear-gradient(135deg,#0C2B4E,#1D546C)] px-6 py-7 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.28em] text-white/65">Content Manager</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Organize teaching assets in one place</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Track videos, PDFs, and reusable resources so the frontend already communicates scale before you ever add upload APIs.
            </p>
          </div>
          <button className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0C2B4E] transition hover:bg-slate-100">
            + Add Asset
          </button>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {["All", "PDF", "Video", "Resource", "Asset"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === type
                ? "bg-[#1D546C] text-white"
                : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {filteredItems.map((item) => (
          <div key={item.id} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{item.course}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                {item.type}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">Updated</p>
                <p className="mt-2 font-semibold text-slate-900">{item.updatedAt}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">Size</p>
                <p className="mt-2 font-semibold text-slate-900">{item.size}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">Usage</p>
                <p className="mt-2 font-semibold text-slate-900">{item.usage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentManager;
