import { LightBulbIcon } from "@heroicons/react/24/outline";

function GrowthInsight({ insight, timeframe }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
          <LightBulbIcon className="h-5 w-5 text-blue-600" />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-800">
            Growth Insight
          </h3>

          <p className="text-sm text-gray-700 leading-relaxed">
            {insight}
          </p>

          {timeframe && (
            <span className="mt-1 text-xs text-gray-500">
              Based on {timeframe}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrowthInsight;
