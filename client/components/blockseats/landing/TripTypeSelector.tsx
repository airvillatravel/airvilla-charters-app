export const TripTypeSelector = ({ itinerary, setItinerary }: any) => (
  <div className="flexjustify-start ml-4 my-2 md:my-0 md:mb-6">
    <button
      type="button"
      className={`px-2 md:px-4 py-2 rounded-s-lg font-bold ${
        itinerary === "one way"
          ? "bg-red-500 text-white"
          : "bg-gray-200 dark:bg-slate-700"
      }`}
      onClick={() => setItinerary("one way")}
    >
      One Way
    </button>
    <button
      type="button"
      className={`px-2 md:px-4 py-2 rounded-e-lg font-bold ${
        itinerary === "round trip"
          ? "bg-red-500 text-white"
          : "bg-gray-200 dark:bg-slate-700"
      }`}
      onClick={() => setItinerary("round trip")}
    >
      Round Trip
    </button>
  </div>
);
