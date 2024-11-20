import {
  selectTicketForm,
  updateTicketForm,
} from "@/redux/features/TicketFormSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React from "react";

import {
  CreateExtraOffersTypes,
  CreateFlightClassesFormTypes,
} from "@/utils/definitions/myTicketsDefinitions";
import { InputField } from "./AddTicketComponents";
import AddTicketDropdown from "./AddTicketDropdown";
import {
  extraOffersAvailableOptions,
  extraOffersNameOptions,
} from "./AddTicketData";

const ExtraOffersSection = ({
  classIdx,
  offerIdx,
  validationError,
}: {
  classIdx: number;
  offerIdx: number;
  validationError: any;
}) => {
  // ############# STATES ############
  // form data
  const formData = useAppSelector(selectTicketForm);
  const offer = formData.flightClasses[classIdx].extraOffers;

  const dispatch = useAppDispatch();

  // ################ FUNCTIONS ################

  // Update the form data with the modified segment
  const handleOfferChanges = (field: string, value: string) => {
    // Update the form data with the modified segment
    const updatedFormData = {
      ...formData,
      flightClasses: formData.flightClasses.map(
        (classes: CreateFlightClassesFormTypes, i: number) =>
          i === classIdx
            ? {
                ...classes,
                extraOffers: classes.extraOffers.map(
                  (offer: CreateExtraOffersTypes, j: number) =>
                    j === offerIdx
                      ? {
                          ...offer,
                          [field]: value,
                        }
                      : offer
                ),
              }
            : classes
      ),
    };

    // Dispatch the updated form state
    dispatch(updateTicketForm(updatedFormData));
  };

  return (
    <div
      key={offerIdx}
      className="md:flex space-y-4 md:space-y-0 md:space-x-4 w-full"
    >
      {/* offer name */}
      <InputField
        label={`Name ${offerIdx !== 0 ? offerIdx + 1 : ""}`}
        tooltip="Select an extra offer or upgrade for this flight ticket."
        validationError={
          validationError &&
          validationError[
            `flightClasses.${classIdx}.extraOffers.${offerIdx}.name`
          ]
        }
        input={
          <AddTicketDropdown
            options={extraOffersNameOptions}
            placeholder="Select an offer"
            value={offer[offerIdx].name || 0}
            handleFlightClassChange={(value: string) =>
              handleOfferChanges("name", value)
            }
          />
        }
      />

      {/* Available */}
      <InputField
        label={`Available ${offerIdx !== 0 ? offerIdx + 1 : ""}`}
        tooltip="Specify if this offer is available, not available, or available for an additional charge."
        validationError={
          validationError &&
          validationError[
            `flightClasses.${classIdx}.extraOffers.${offerIdx}.available`
          ]
        }
        input={
          <AddTicketDropdown
            options={extraOffersAvailableOptions}
            placeholder="offer type"
            value={offer[offerIdx].available || 0}
            handleFlightClassChange={(value: string) =>
              handleOfferChanges("available", value)
            }
          />
        }
      />
    </div>
  );
};

export default ExtraOffersSection;
