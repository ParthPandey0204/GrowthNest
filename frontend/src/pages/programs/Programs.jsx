import { Link } from "react-router-dom";
import { useInfiniteCourses } from "../../services/course.service";

function Programs() {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteCourses();
  const programs = data?.pages.flatMap((page) => page.courses) ?? [];

  return (
    <div className="space-y-7">
      <section className="rounded-[30px] bg-[linear-gradient(135deg,#0C2B4E,#1D546C)] px-6 py-8 text-white shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-100/70">Learning catalogue</p>
        <h1 className="mt-2 text-3xl font-semibold">Find your next program</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-sky-50/80">Explore mentor-led programs and enrol when you are ready to begin.</p>
      </section>

      {isLoading && <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-3xl bg-slate-200" />)}</div>}
      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">Unable to load programs. Please try again.</div>}
      {!isLoading && !error && (
        <>
          {programs.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">No published programs are available yet.</div> : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {programs.map((program) => (
                <article key={program.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="h-28 bg-[linear-gradient(135deg,#e0f2fe,#dbeafe)]" style={program.thumbnail ? { backgroundImage: `url(${program.thumbnail})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#1D546C]">Mentor {program.mentor?.name ?? "GrowthNest"}</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">{program.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{program.description || "A mentor-led learning program."}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{program.price ? `₹${program.price}` : "Free"}</span>
                      <Link to={`/programs/${program.id}`} className="rounded-xl bg-[#1D546C] px-3 py-2 text-sm font-medium text-white">View program</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          {hasNextPage && <div className="text-center"><button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">{isFetchingNextPage ? "Loading..." : "Load more"}</button></div>}
        </>
      )}
    </div>
  );
}

export default Programs;
