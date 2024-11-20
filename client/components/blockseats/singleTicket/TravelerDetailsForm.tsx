"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { travelerFormValidation } from "@/utils/validators/travelerFormValiditions";
import { Traveler, Errors } from "@/utils/definitions/blockseatsDefinitions";
import { TravelerForm } from "./TravelerForm";
import { useRouter } from "next/navigation";
import { FlightTicketRes } from "@/utils/definitions/blockseatsDefinitions";
import { useSearchState } from "@/components/hooks/useSearchState";
import { useSearchTickets } from "@/components/hooks/useSearchTicket";

export default function TravelerDetailsForm({
  ticket,
}: {
  ticket: FlightTicketRes;
}) {
  const initialTravelerState: Traveler = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    passportIssuingCountry: "",
    passportExpiry: "",
    errors: {},
  };
  const { state } = useSearchTickets();

  // Calculate total number of travelers based on adults, children, and infants in searchState
  const totalPassengers =
    state.passengers.adults +
    state.passengers.children +
    state.passengers.infants;

  // Initialize travelers state
  const [travelers, setTravelers] = useState<Traveler[]>([]);

  useEffect(() => {
    // Update the travelers array whenever totalPassengers changes
    const updatedTravelers = Array(totalPassengers).fill(initialTravelerState);
    setTravelers(updatedTravelers);
  }, [totalPassengers]);

  const [allTravelerData, setAllTravelerData] = useState<Traveler[]>([]);
  const router = useRouter();

  const validateForm = useCallback(() => {
    let isValid = true;
    const updatedTravelers = travelers.map((traveler) => {
      const { errors, ...travelerData } = traveler;
      const { error } = travelerFormValidation.validate(travelerData, {
        abortEarly: false,
      });

      const newErrors: Errors = {};
      if (error) {
        error.details.forEach((detail) => {
          newErrors[detail.path[0]] = detail.message;
        });
        isValid = false;
      }

      return { ...traveler, errors: newErrors };
    });

    setTravelers(updatedTravelers);

    return isValid;
  }, [travelers]);

  const isFormValid = useMemo(() => {
    const isTravelerValid = travelers.every(
      (traveler) => Object.keys(traveler.errors).length === 0
    );
    return isTravelerValid;
  }, [travelers]);

  const handleProceedToPayment = () => {
    if (validateForm()) {
      // Collect all traveler data
      const allData = travelers.map(({ errors, ...travelerData }) => ({
        ...travelerData,
        errors: {},
      }));
      setAllTravelerData(allData);

      router.push(`/blockseats/list/${ticket.id}/checkout`);
    } else {
      console.log("Please complete all required fields.");
    }
  };

  // handle traveler data update
  const handleTravelerUpdate = useCallback(
    (index: number, updatedTraveler: Traveler) => {
      setTravelers((prevTravelers) => {
        const newTravelers = [...prevTravelers];
        newTravelers[index] = updatedTraveler;
        return newTravelers;
      });
    },
    []
  );

  return (
    <div className="mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md my-4 border border-gray-300 dark:border-gray-700">
      <h3 className="text-xl md:text-4xl font-inter font-bold mb-2 leading-[46px] text-gray-800 dark:text-white py-1 md:py-5 px-6">
        Traveler Details
      </h3>
      <hr className="border-t border-gray-300 dark:border-gray-700" />
      <div className="p-5">
        <div className="bg-red-100/80 dark:bg-red-800/30 text-gray-700 dark:text-red-200 p-3 rounded-lg mb-4">
          <span className="font-semibold mr-2 bg-red-500 text-white px-2 py-1 rounded-lg">
            New
          </span>
          Please make sure you enter the Name as per your passport
        </div>

        {travelers.map((traveler, index) => (
          <TravelerForm
            key={index}
            travelerNumber={index + 1}
            traveler={traveler}
            onUpdate={(updatedTraveler: Traveler) =>
              handleTravelerUpdate(index, updatedTraveler)
            }
          />
        ))}

        <button
          type="button"
          onClick={handleProceedToPayment}
          disabled={!isFormValid}
          className={`w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Proceed To Payment
        </button>
      </div>
    </div>
  );
}
