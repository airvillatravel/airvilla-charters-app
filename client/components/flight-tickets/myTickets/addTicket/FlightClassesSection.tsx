"use client";
import {
  addExtraOffers,
  removeExtraOffers,
  selectTicketForm,
  updateTicketForm,
} from "@/redux/features/TicketFormSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import React from "react";
import ExtraOffersSection from "./ExtraOffersSection";
import AddTicketDropdown from "./AddTicketDropdown";

import {
  CreateExtraOffersTypes,
  CreateFlightClassesFormTypes,
} from "@/utils/definitions/myTicketsDefinitions";
import {
  carryOnAllowedOptions,
  carryOnWeightOptions,
  checkedAllowedOptions,
  checkedWeightOptions,
  flightClassOptions,
} from "./AddTicketData";
import { Card, EmptyState, InputField } from "./AddTicketComponents";
import { CreditCard, Gift, Luggage, Plus, Trash2, Users } from "lucide-react";

const FlightClassesSection = ({
  classIdx,
  validationError,
}: {
  classIdx: number;
  validationError: any;
}) => {
  // ############### STATES ##############
  // segment from data
  const formData = useAppSelector(selectTicketForm);
  const flightClass = formData.flightClasses[classIdx];
  const dispatch = useAppDispatch();
  // ########## functions ############

  // Handle flight class field changes
  const handleFlightClassesChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    const [field, _] = id.split("-");

    // Update the form data with the modified segment
    const updatedFormData = {
      ...formData,
      flightClasses: formData.flightClasses.map(
        (classes: CreateFlightClassesFormTypes, i: number) =>
          i === classIdx
            ? {
                ...classes,
                [field]: value,
              }
            : classes
      ),
    };

    // Dispatch the updated form state
    dispatch(updateTicketForm(updatedFormData));
  };

  // handle dropdown changes
  const handleDropdownChanges = (field: string, value: string) => {
    const updatedFormData = {
      ...formData,
      flightClasses: formData.flightClasses.map(
        (classes: CreateFlightClassesFormTypes, i: number) =>
          i === classIdx
            ? {
                ...classes,
                [field]: typeof value === "string" ? value : parseInt(value),
              }
            : classes
      ),
    };

    // Dispatch the updated form state
    dispatch(updateTicketForm(updatedFormData));
  };
  // update price change
  const handlePriceChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    const [field, _] = id.split("-");

    // Update the form data with the modified segment
    const updatedFormData = {
      ...formData,
      flightClasses: formData.flightClasses.map(
        (classes: CreateFlightClassesFormTypes, i: number) =>
          i === classIdx
            ? {
                ...classes,
                price: {
                  ...classes.price,
                  [field]: value,
                },
              }
            : classes
      ),
    };

    // Dispatch the updated form state
    dispatch(updateTicketForm(updatedFormData));
  };

  return (
    <div className="space-y-6 pt-2.5">
      {/* FLight Class Type */}
      <Card
        icon={<Users color="#EE4544" />}
        title={`Flight Class ${classIdx !== 0 ? classIdx + 1 : ""}`}
      >
        <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
          {/* Type */}
          <InputField
            label={`Type ${classIdx !== 0 ? classIdx + 1 : ""}`}
            tooltip="Select the class of service for this flight ticket (e.g., Economy, Business, First Class)."
            validationError={
              validationError &&
              validationError[`flightClasses.${classIdx}.type`]
            }
            input={
              <AddTicketDropdown
                options={flightClassOptions}
                placeholder="Select Flight Class"
                value={flightClass.type}
                handleFlightClassChange={(value: string) =>
                  handleDropdownChanges("type", value)
                }
              />
            }
          />
        </div>
      </Card>

      {/* Baggage */}
      <Card
        icon={<Luggage color="#EE4544" />}
        title={`Baggage ${classIdx !== 0 ? classIdx + 1 : ""}`}
      >
        <div className="space-y-5 my-4">
          <div className="md:flex justify-center items-center space-y-5 md:space-y-0 md:space-x-4">
            {/* Carry On Allowed */}
            <InputField
              label={`Carry On Allowed ${classIdx !== 0 ? classIdx + 1 : ""}`}
              tooltip="Enter the number of carry-on bags allowed per passenger in the cabin."
              validationError={
                validationError &&
                validationError[`flightClasses.${classIdx}.carryOnAllowed`]
              }
              input={
                <AddTicketDropdown
                  options={carryOnAllowedOptions}
                  placeholder="Number of carry-on bags"
                  value={flightClass.carryOnAllowed || undefined}
                  handleFlightClassChange={(value: string) =>
                    handleDropdownChanges("carryOnAllowed", value)
                  }
                />
              }
            />

            {/* Carry On Weight */}
            <InputField
              label={`Carry-On Weight (kg) ${
                classIdx !== 0 ? classIdx + 1 : ""
              }`}
              tooltip="Enter the maximum weight allowed for each carry-on bag in kilograms."
              validationError={
                validationError &&
                validationError[`flightClasses.${classIdx}.carryOnWeight`]
              }
              input={
                <AddTicketDropdown
                  options={carryOnWeightOptions}
                  placeholder="Max weight per bag"
                  value={flightClass.carryOnWeight || undefined}
                  handleFlightClassChange={(value: string) =>
                    handleDropdownChanges("carryOnWeight", value)
                  }
                />
              }
            />
          </div>

          {/* ROW 3 */}
          <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
            {/* Checked Allowed */}
            <InputField
              label={`Checked Allowed ${classIdx !== 0 ? classIdx + 1 : ""}`}
              tooltip="Enter the number of checked bags allowed per passenger without additional fees."
              validationError={
                validationError &&
                validationError[`flightClasses.${classIdx}.checkedAllowed`]
              }
              input={
                <AddTicketDropdown
                  options={checkedAllowedOptions}
                  placeholder="Number of checked bags"
                  value={flightClass.checkedAllowed || undefined}
                  handleFlightClassChange={(value: string) =>
                    handleDropdownChanges("checkedAllowed", value)
                  }
                />
              }
            />

            {/* Checked Weight */}
            <InputField
              label={`Checked Weight (kg)${classIdx !== 0 ? classIdx + 1 : ""}`}
              tooltip="Enter the maximum weight allowed for each checked bag in kilograms."
              validationError={
                validationError &&
                validationError[`flightClasses.${classIdx}.checkedWeight`]
              }
              input={
                <AddTicketDropdown
                  options={checkedWeightOptions}
                  placeholder="Max weight per bag"
                  value={flightClass.checkedWeight || undefined}
                  handleFlightClassChange={(value: string) =>
                    handleDropdownChanges("checkedWeight", value)
                  }
                />
              }
            />
          </div>

          {/* ROW 4 */}
          <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
            {/* checkedFee */}
            <InputField
              id={`checkedFee-${classIdx}`}
              label={`Checked Fee (1kg/JOD) ${
                classIdx !== 0 ? classIdx + 1 : ""
              }`}
              type="number"
              min={0}
              placeholder="Fee for first checked bag"
              tooltip="Enter the fee for the first checked bag in JOD. Enter 0 if there's no fee for the first bag."
              value={flightClass.checkedFee ?? ""}
              onChange={handleFlightClassesChange}
              validationError={
                validationError &&
                validationError[`flightClasses.${classIdx}.checkedFee`]
              }
            />

            {/* additionalFee */}
            <InputField
              id={`additionalFee-${classIdx}`}
              label={`Additional Checked Fee (1kg/JOD) ${
                classIdx !== 0 ? classIdx + 1 : ""
              }`}
              type="number"
              min={0}
              placeholder="Fee for additional bags"
              tooltip="Enter the fee for each additional checked bag beyond the included allowance."
              value={flightClass.additionalFee ?? ""}
              onChange={handleFlightClassesChange}
              validationError={
                validationError &&
                validationError[`flightClasses.${classIdx}.additionalFee`]
              }
            />
          </div>
        </div>
      </Card>

      {/* Price */}
      <Card
        icon={<CreditCard color="#EE4544" />}
        title={`Price ${classIdx !== 0 ? classIdx + 1 : ""}`}
      >
        <div className="space-y-4 my-4">
          {/* row 1 */}
          <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
            {/* adult */}
            <InputField
              id={`adult-${classIdx}`}
              label={`Adult (JOD) ${classIdx !== 0 ? classIdx + 1 : ""}`}
              type="number"
              min={0}
              placeholder="Adult price"
              tooltip="Enter the ticket price for adult passengers in Jordanian Dinars."
              value={flightClass.price.adult ?? ""}
              onChange={handlePriceChange}
              validationError={
                validationError &&
                validationError[`flightClasses.${classIdx}.price.adult`]
              }
            />

            {/* child */}
            <InputField
              id={`child-${classIdx}`}
              label={`Child (JOD) ${classIdx !== 0 ? classIdx + 1 : ""}`}
              type="number"
              min={0}
              placeholder="Child price"
              tooltip="Enter the ticket price for child passengers (2-12 years old) in Jordanian Dinars."
              value={flightClass.price.child ?? ""}
              onChange={handlePriceChange}
              validationError={
                validationError &&
                validationError[`flightClasses.${classIdx}.price.child`]
              }
            />
          </div>

          {/* row 2 */}
          <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
            {/* infant */}
            <InputField
              id={`infant-${classIdx}`}
              label={`Infant (JOD) ${classIdx !== 0 ? classIdx + 1 : ""}`}
              type="number"
              min={0}
              placeholder="Infant price"
              tooltip="Enter the ticket price for infant passengers (0-2 years old) in Jordanian Dinars."
              value={flightClass.price.infant ?? ""}
              onChange={handlePriceChange}
              validationError={
                validationError &&
                validationError[`flightClasses.${classIdx}.price.infant`]
              }
            />
            {/* tax */}
            <InputField
              id={`tax-${classIdx}`}
              label={`tax (JOD) ${classIdx !== 0 ? classIdx + 1 : ""}`}
              type="number"
              min={0}
              placeholder="Tax percentage"
              tooltip="Enter the tax percentage that will be applied to the ticket price. Use whole numbers (e.g., 10 for 10%)."
              value={flightClass.price.tax ?? ""}
              onChange={handlePriceChange}
              validationError={
                validationError &&
                validationError[`flightClasses.${classIdx}.price.tax`]
              }
            />
          </div>
        </div>
      </Card>

      {/* Extra Offers Card */}
      <Card
        icon={<Gift color="#EE4544" />}
        title={`Extra Offers ${classIdx !== 0 ? classIdx + 1 : ""}`}
      >
        {flightClass.extraOffers.length === 0 ? (
          <EmptyState
            icon={<Gift size={48} color="#EE4544" />}
            title="No Extra Offers Yet"
            description="Click the button below to add special offers or upgrades for this flight."
          />
        ) : (
          <div className="space-y-4">
            {flightClass.extraOffers.map(
              (offer: CreateExtraOffersTypes, offerIdx: number) => (
                <div
                  key={offerIdx + offer.name}
                  className="flex justify-between items-center"
                >
                  <ExtraOffersSection
                    classIdx={classIdx}
                    offerIdx={offerIdx}
                    validationError={validationError}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(removeExtraOffers({ classIdx, offerIdx }))
                    }
                    className="mt-6 p-2 text-red-500 hover:text-red-600 transition-colors duration-300"
                    title="Delete offer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )
            )}
          </div>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mt-6 shadow-md hover:shadow-lg transition-all duration-300 "
          type="button"
          onClick={() => dispatch(addExtraOffers({ classIdx }))}
        >
          <Plus size={20} className="mr-2" />
          Add Extra Offer
        </button>
      </Card>
    </div>
  );
};

export default FlightClassesSection;
