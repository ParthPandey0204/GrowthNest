import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function CoursePerformanceChart({ data }) {
  return (
    <div
      className="w-full rounded-xl border bg-white p-5 shadow-sm"
      style={{ height: "320px" }}
    >
      <h3 className="mb-3 text-lg font-semibold text-gray-800">
        Course Performance
      </h3>

      <div className="w-full h-[85%]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="courseName" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="learners"
              fill="#1D546C"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CoursePerformanceChart;
