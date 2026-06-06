import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function EngagementChart({ data }) {
  return (
    <div
      className="rounded-xl border bg-white p-5 shadow-sm"
      style={{ height: "320px" }}
    >
      <h3 className="mb-3 text-lg font-semibold text-gray-800">
        Engagement Over Time
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="engagementScore"
            stroke="#1D546C"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EngagementChart;
