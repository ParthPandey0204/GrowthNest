import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function RevenueChart({ data }) {
  return (
    <div
      className="rounded-xl border bg-white p-5 shadow-sm"
      style={{ height: "320px" }}
    >
      <h3 className="mb-3 text-lg font-semibold text-gray-800">
        Revenue Over Time
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => `?${value}`} />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#16A34A"
            fill="#86EFAC"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
