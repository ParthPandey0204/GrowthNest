import {
  ArrowTrendingUpIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const StatsData = [
  {
    id: 'earnings',
    title: 'Total Earnings',
    value: '₹18,450',
    icon: CurrencyDollarIcon,
  },
  {
    id: 'learners',
    title: 'Active Learners',
    value: '124',
    icon: UsersIcon,
  },
  {
    id: 'growth',
    title: 'Monthly Growth',
    value: '+12%',
    icon: ArrowTrendingUpIcon,
  },
  {
    id: 'sessions',
    title: 'Sessions Completed',
    value: '36',
    icon: ClockIcon,
  },
];

export default StatsData;
