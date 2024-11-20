import LocationField from "./LocationField";

export const LocationSelector = ({
  label,
  icon: Icon,
  value,
  onChange,
  disabledOption,
  error,
}: {
  label: string;
  icon: any;
  value: string;
  onChange: (value: any) => void;
  disabledOption?: string;
  error?: string;
}) => {
  return (
    <div className="relative">
      <div
        className={`bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-4 ${
          error ? "border-red-500 border-2" : ""
        }`}
      >
        <label className="flex items-center space-x-3 mb-2">
          <Icon className="text-gray-400" size={20} />
          <span>{label}</span>
        </label>
        <LocationField
          segmentIndex={0}
          act={label === "From" ? "departure" : "arrival"}
          disabled={disabledOption!}
          validationError={error}
          onChange={onChange}
          inputValue={value}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
