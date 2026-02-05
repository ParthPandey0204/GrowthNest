function Analytics() {
  return (
    <div className="space-y-10">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-[#1D546C] px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-white">Analytics</h1>
          <p className="text-xs text-white/70">Home / Analytics</p>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="px-2">
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          Analytics content will appear here
        </div>
      </div>
    </div>
  );
}

export default Analytics;
