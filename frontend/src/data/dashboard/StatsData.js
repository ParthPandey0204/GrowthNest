import {
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

const StatsData = [
  {
    title: "Total Learners",
    value: 128,
    change: 12.5,
    trend: "up",
    icon: UsersIcon,
    color: "blue",
  },
  {
    title: "Active Courses",
    value: 6,
    change: 8.2,
    trend: "up",
    icon: PlayIcon,
    color: "purple",
  },
  {
    title: "Live Sessions",
    value: 14,
    change: -3.1,
    trend: "down",
    icon: ClockIcon,
    color: "orange",
  },
  {
    title: "Revenue",
    value: 42000,
    change: 18.9,
    trend: "up",
    icon: CurrencyDollarIcon,
    color: "green",
  },
];

export default StatsData;
