import { CheckCircle } from "lucide-react";

export default function OnboardingProgress({ step = 1 }: { step?: number }) {
  return (
    <div className="px-4">
      <div className=" w-full">
        <div className="relative">
          <div
            className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-gray-300 dark:bg-slate-700"
            aria-hidden="true"
          ></div>
          <ul className="relative flex justify-between w-full">
            {Array.from(Array(4).keys()).map((number) => (
              <li key={number}>
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                    step >= number + 1
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-600 dark:bg-slate-700 dark:text-slate-400"
                  }`}
                >
                  {step >= number + 1 ? (
                    <CheckCircle
                      className="text-white"
                      size={16}
                      aria-hidden="true"
                    />
                  ) : (
                    number + 1
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
