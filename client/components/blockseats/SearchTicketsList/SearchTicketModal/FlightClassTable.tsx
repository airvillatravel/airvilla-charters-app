import { FlightClassProps } from "@/utils/definitions/blockseatsDefinitions";

export const FlightClassTable = ({ flightClasses }: FlightClassProps) => (
  <div className="overflow-x-auto overflow-y-hidden -webkit-overflow-scrolling-touch">
    <div className="pb-4 text-gray-500 dark:text-gray-400 text-left pt-8 border-t border-gray-300 dark:border-gray-700">
      Class:{" "}
      <span className="font-bold text-gray-500 dark:text-white capitalize">
        {flightClasses.type}
      </span>
    </div>
    <table className="table caption-bottom mb-0 w-11/12 mx-auto">
      <caption className="pb-0 text-gray-500 dark:text-gray-400 text-left pt-8">
        *From The Date Of Departure
      </caption>
      <thead className="bg-gray-800 text-white dark:bg-gray-900">
        <tr>
          <th scope="col" className="border-0 rounded-tl-md p-2">
            Person
          </th>
          <th scope="col" className="border-0 rounded-tr-md p-2">
            Total Fees
          </th>
        </tr>
      </thead>
      <tbody className="text-gray-500 dark:text-gray-400">
        {Object.entries(flightClasses.price)
          .filter(([key]) => key !== "id" && key !== "flightClassId")
          .map(([key, value]) => (
            <tr key={key}>
              <td className="p-2 text-center border dark:border-gray-700">
                {key}
              </td>
              <td className="p-2 text-center border dark:border-gray-700">
                {typeof value === "number" ? value.toFixed(2) : value}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);
