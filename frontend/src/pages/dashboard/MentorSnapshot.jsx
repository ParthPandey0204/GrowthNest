import { UsersIcon, ClockIcon, ChartBarIcon } from "@heroicons/react/24/outline";

function MentorSnapshot({ metrics = [] }) {
  const icons = [UsersIcon, ChartBarIcon, ClockIcon];

  return (
    <div className="relative rounded-2xl bg-white p-6 pl-7 shadow-sm">
      <div className="absolute bottom-4 left-0 top-4 w-1 rounded-full bg-[#1D546C]" />
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Mentor Performance Snapshot</h3><span className="text-xs text-gray-400">Current data</span></div>
      <p className="mt-1 text-sm text-gray-500">A live overview of your programs and learner activity.</p>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = icons[index] ?? UsersIcon;
          return <div key={metric.id} className="rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm"><Icon className="h-5 w-5 text-gray-600" /></div><div><p className="text-sm text-gray-500">{metric.label}</p><p className="text-xl font-semibold text-gray-900">{metric.value}</p></div></div><p className="mt-2 text-xs text-gray-400">{metric.hint}</p></div>;
        })}
      </div>
    </div>
  );
}

export default MentorSnapshot;
