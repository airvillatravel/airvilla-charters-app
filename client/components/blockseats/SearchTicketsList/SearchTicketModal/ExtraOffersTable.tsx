import { getAvailabilityIcon } from "@/utils/functions/functions";
import { FlightClassProps } from "@/utils/definitions/blockseatsDefinitions";
import { FlightExtraOfferRes } from "@/utils/definitions/blockseatsDefinitions";

export const ExtraOffersTable = ({ flightClasses }: FlightClassProps) => (
  <div className="overflow-x-auto overflow-y-hidden -webkit-overflow-scrolling-touch">
    <div className="pb-4 text-gray-500 dark:text-gray-400 text-left pt-8">
      Class:{" "}
      <span className="font-bold text-gray-500 dark:text-white capitalize">
        {flightClasses.type}
      </span>
    </div>
    <table className="table caption-bottom mb-0 w-full">
      <caption className="pb-0 text-gray-500 dark:text-gray-600 text-left pt-2">
        *From The Date Of Departure
      </caption>
      <thead className="bg-gray-800 text-white dark:bg-gray-900">
        <tr>
          <th scope="col" className="border-0 rounded-tl-md p-2">
            Extra Offers
          </th>
          <th scope="col" className="border-0 rounded-tr-md p-2">
            Availability
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
        {flightClasses.extraOffers && flightClasses.extraOffers.length > 0 ? (
          flightClasses.extraOffers.map(
            (offer: FlightExtraOfferRes, offerIndex: number) => (
              <tr key={offerIndex}>
                <td className="p-2 text-center border dark:border-gray-700">
                  {offer.name || "Unknown"}
                </td>
                <td className="p-2 text-center border dark:border-gray-700">
                  {offer.available !== undefined
                    ? getAvailabilityIcon(offer.available)
                    : "N/A"}
                </td>
              </tr>
            )
          )
        ) : (
          <tr>
            <td colSpan={2} className="p-2 text-center dark:border-gray-700">
              No extra offers available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
