import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

const StatCard = ({
  title,
  value,
  change,
  trend = "up",
  icon: IconComponent,
  color = "blue",
  onClick,
}) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-700",
      green: "bg-green-50 text-green-700",
      purple: "bg-purple-50 text-purple-700",
      orange: "bg-orange-50 text-orange-700",
      indigo: "bg-indigo-50 text-indigo-700",
    };
    return colors[color] || colors.blue;
  };

  const formatChange = (change) =>
    `${change >= 0 ? "+" : ""}${change}%`;

  return (
    <div
      onClick={onClick}
      className="
        relative
        rounded-2xl
        bg-white
        p-6
        pl-7
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md
        hover:-translate-y-0.5
        cursor-pointer
      "
    >
      {/* Vertical Accent Line */}
      <div className="absolute left-0 top-4 bottom-4 w-0.75 bg-[#1D546C] rounded-full" />

      {/* Icon */}
      <div
        className={`
          absolute
          -top-3
          -right-3
          h-11
          w-11
          rounded-xl
          flex
          items-center
          justify-center
          ${getColorClasses(color)}
        `}
      >
        <IconComponent className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </p>

        <p className="text-3xl font-semibold text-gray-900">
          {value.toLocaleString()}
        </p>

        <div className="flex items-center gap-2">
          <span
            className={`
              rounded-full
              px-2
              py-0.5
              text-xs
              font-semibold
              ${
                trend === "up"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {formatChange(change)}
          </span>

          <ArrowTrendingUpIcon
            className={`h-4 w-4 ${
              trend === "up"
                ? "text-green-500"
                : "text-red-500 rotate-180"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
