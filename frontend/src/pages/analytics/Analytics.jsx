import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import EngagementChart from "../../components/analytics/EngagementChart";
import RevenueChart from "../../components/analytics/RevenueChart";

import CoursePerformanceChart from "../../components/analytics/CoursePerformanceChart";
import SessionAnalyticsChart from "../../components/analytics/SessionAnalyticsChart";
import { getCourseAnalytics } from "../../api/courses.api";
import { useCourses } from "../../services/course.service";

const TIME_RANGES = ["7 Days", "30 Days", "90 Days"];

function Analytics() {
  const [timeRange, setTimeRange] = useState("30 Days");
  const [courseId, setCourseId] = useState("");
  const { data: coursesResponse } = useCourses();
  const courses = coursesResponse?.courses ?? [];
  const selectedCourseId = courseId || courses[0]?.id;
  const range = Number(timeRange.split(" ")[0]);
  const { data: analytics } = useQuery({
    queryKey: ["course-analytics", selectedCourseId, range],
    queryFn: () => getCourseAnalytics(selectedCourseId, range),
    enabled: Boolean(selectedCourseId),
  });
  const engagementData = analytics?.engagement ?? [];
  const revenueData = analytics?.revenue ?? [];
  const courseData = analytics?.coursePerformance ?? [];
  const sessionAnalyticsData = analytics?.sessions ?? [];
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#0C2B4E]">Analytics</h1>
        <p className="text-sm text-gray-500">Home / Analytics</p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                timeRange === range
                  ? "bg-[#1D546C] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <select
          value={selectedCourseId || ""}
          onChange={(e) => setCourseId(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D546C]/40"
        >
          <option value="" disabled>Select a course</option>
          {courses.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </div>

   
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EngagementChart data={engagementData} />
        <RevenueChart data={revenueData} />
      </div>

      <div className="rounded-xl border bg-white h-80 flex items-center justify-center text-sm text-gray-400">
        <CoursePerformanceChart data={courseData} />
      </div>

      
      <div className="rounded-xl border bg-white h-56 flex items-center justify-center text-sm text-gray-400">
        <SessionAnalyticsChart data={sessionAnalyticsData} />
      </div>
    </div>
  );
}
export default Analytics;
