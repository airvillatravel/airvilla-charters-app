import { getCheckedFeeText } from "@/utils/functions/functions";
import { FlightClassProps } from "@/utils/definitions/blockseatsDefinitions";

export const BaggageTable = ({ flightClasses }: FlightClassProps) => (
  <div className="overflow-x-auto overflow-y-hidden -webkit-overflow-scrolling-touch mx-auto">
    <div className="mb-4">
      <div className="pb-4 text-gray-500 dark:text-gray-400 text-left pt-8 border-t border-gray-300 dark:border-gray-700">
        Class:{" "}
        <span className="font-bold text-gray-500 dark:text-white capitalize">
          {flightClasses.type}
        </span>
      </div>
      <table className="table caption-bottom mb-0 w-full">
        <caption className="pb-0 text-gray-500 dark:text-gray-400 pt-2 text-left">
          {/* *1PC = 23KG */}
        </caption>
        <thead className="bg-gray-800 text-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <tr>
            <th
              scope="col"
              className=" border border-gray-300 dark:border-gray-700 rounded-tl-md p-2"
            >
              Baggage Type
            </th>
            <th
              scope="col"
              className="border border-gray-300 dark:border-gray-700 p-2"
            >
              Allowed
            </th>
            <th
              scope="col"
              className="border border-gray-300 dark:border-gray-700 p-2"
            >
              Weight
            </th>
            <th
              scope="col"
              className="border border-gray-300 dark:border-gray-700 rounded-tr-md p-2"
            >
              Fee
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800">
          <tr>
            <td className="border p-2 text-center dark:border-gray-700">
              Carry-On
            </td>
            <td className="border p-2 text-center dark:border-gray-700">
              {flightClasses.carryOnAllowed} bag
            </td>
            <td className="border p-2 text-center dark:border-gray-700">
              {flightClasses.carryOnWeight} Kg
            </td>
            <td className="border p-2 text-center dark:border-gray-700">
              Free
            </td>
          </tr>
          <tr>
            <td className="border p-2 text-center dark:border-gray-700">
              Checked {flightClasses.additionalFee ? "/ Additional" : ""}
            </td>
            <td className="border p-2 text-center dark:border-gray-700">
              {flightClasses.checkedAllowed} bags
            </td>
            <td className="border p-2 text-center dark:border-gray-700">
              {flightClasses.checkedWeight} Kg each
            </td>
            <td className="border p-2 text-center dark:border-gray-700">
              {getCheckedFeeText(
                flightClasses.checkedFee!,
                flightClasses.additionalFee!
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
