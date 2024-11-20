import { Info, Lock } from "lucide-react";

export default function AccountOverviewInputField({
  label,
  id,
  icon,
  value,
  disabled,
  required,
  tooltip,
  locked,
  onChange,
  validationError,
}: {
  label: string;
  id: string;
  icon: JSX.Element;
  value: string | undefined;
  disabled?: boolean;
  required?: boolean;
  tooltip?: string;
  locked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationError?: string;
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium dark:text-gray-400 mb-1"
        htmlFor={id}
      >
        {label} {required && <span className="text-red-500">*</span>}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          {icon}
        </span>
        <input
          id={id}
          type="text"
          className={`dark:bg-gray-700 text-gray-600 dark:text-white rounded-lg pl-10 pr-4 py-1.5 md:py-2 w-full outline-none transition-all duration-300 border-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 border-0 ${
            locked ? "cursor-not-allowed" : ""
          }`}
          value={value || ""}
          disabled={disabled}
          readOnly={locked}
          onChange={onChange ? (e) => onChange(e) : undefined}
        />
        {locked && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            <Lock size={18} />
          </span>
        )}
      </div>
      {validationError && (
        <div className="text-[10px] mt-1 text-rose-500">{validationError}</div>
      )}
    </div>
  );
}

export const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-1">
    <Info size={16} className="text-gray-500 cursor-help" />
    <div className="opacity-0 bg-gray-200 dark:bg-gray-800 dark:text-white text-xs rounded-lg py-2 px-3 absolute z-10 bottom-full left-1/2 transform -translate-x-12 -translate-y-2 group-hover:opacity-100 transition-opacity duration-300 w-48 pointer-events-none border border-gray-300 dark:border-gray-700">
      {text}
      {/* <svg
        className="absolute text-gray-800 h-2 w-full left-0 top-full"
        x="0px"
        y="0px"
        viewBox="0 0 255 255"
      >
        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
      </svg> */}
    </div>
  </div>
);
