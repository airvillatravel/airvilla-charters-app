import React from "react";
import { Slider } from "antd";
import { PriceFilterProps } from "@/utils/definitions/blockseatsDefinitions";

export const PriceFilter = ({
  minValue,
  maxValue,
  minLimit,
  maxLimit,
  onMinChange,
  onMaxChange,
  onSliderChange,
}: PriceFilterProps) => {
  return (
    <>
      <div className="flex justify-between">
        <input
          type="number"
          value={minValue}
          onChange={onMinChange}
          className="border-none outline-none focus:outline-none w-1/2 pl-0 text-start text-gray-700 dark:text-gray-300 dark:bg-gray-800 rounded-lg"
          placeholder="Min"
        />
        <input
          type="number"
          value={maxValue}
          onChange={onMaxChange}
          className="border-none px-1 outline-none focus:outline-none w-1/2 text-right text-gray-700 dark:text-gray-300 dark:bg-gray-800 rounded-lg"
          placeholder="Max"
        />
      </div>
      <Slider
        range
        min={minLimit}
        max={maxLimit}
        value={[minValue, maxValue]}
        onChange={([min, max]) => onSliderChange(min, max)}
        styles={{
          rail: { backgroundColor: "#fee2e2" },
          track: { backgroundColor: "#f87171" },
          handle: { backgroundColor: "#f87171", borderColor: "#f87171" },
        }}
      />
    </>
  );
};
