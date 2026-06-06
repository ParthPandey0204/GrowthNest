import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function SessionAnalyticsChart({ data }) {
  return (
    <div
      className="w-full rounded-xl border bg-white p-5 shadow-sm"
      style={{ height: "300px" }}
    >
      <h3 className="mb-3 text-lg font-semibold text-gray-800">
        Session Attendance
      </h3>

      <div className="w-full h-[85%]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="session" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="attendees"
              fill="#6366F1"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SessionAnalyticsChart;
