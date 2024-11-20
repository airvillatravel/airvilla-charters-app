import React, { useCallback, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectSingleTicket,
  setTicketUpdateData,
} from "@/redux/features/SingleTicketSlice";
import {
  UserExtraOffersResultType,
  UserFlightClassResultType,
  UserTicketResultType,
} from "@/utils/definitions/myTicketsDefinitions";
import { setLoading } from "@/redux/features/LoadingSlice";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { updateUserTicketStatus } from "@/lib/data/userTicketData";
import { updateSingleMasterTicket } from "@/lib/data/masterTicketsData";
import { statusOptions } from "../addTicket/AddTicketData";

interface DropdownOption {
  id: number;
  [key: string]: any; // This allows for additional properties
}
// Define a type for the function's return value
type FetchTicketResult = {
  success: boolean;
  message: string;
  results?: any; // You might want to replace 'any' with a more specific type
};

interface ReusableDropdownProps {
  options: DropdownOption[];
  initialSelectedId: number;
  onSelectionChange?: (selectedOption: DropdownOption) => void;
  placeholder: string;
  classIdx?: number;
  offerIdx?: number;
  displayKey?: string; // New prop to specify which key to display
  refId?: string; // Added to track the ticket ID
  isTicketStatus?: boolean;
  isBaggageDropdown?: boolean;
  baggage?:
    | "carryOnAllowed"
    | "carryOnWeight"
    | "checkedAllowed"
    | "checkedWeight";
  value?: string;
  field?: "name" | "available";
  isMasterAdmin?: boolean;
}

const ReusableDropdown = ({
  options,
  initialSelectedId,
  onSelectionChange,
  placeholder,
  classIdx,
  offerIdx,
  displayKey = "value", // Default to 'value' if not specified
  refId,
  isTicketStatus,
  isBaggageDropdown,
  baggage,
  value,
  field,
  isMasterAdmin = false,
}: ReusableDropdownProps) => {
  const dispatch = useAppDispatch();
  const ticket = useAppSelector(selectSingleTicket) as UserTicketResultType;

  const [selected, setSelected] = useState<number>(() => {
    if (classIdx !== undefined && offerIdx !== undefined) {
      // Fetch the selected offer name from the ticket state using classIdx and offerIdx
      const flightClass = ticket.flightClasses[classIdx];
      const offer = flightClass?.extraOffers[offerIdx];
      const selectedElm = options.find(
        (elm) =>
          elm.value.toLowerCase().trim() === offer?.name?.toLowerCase().trim()
      );
      return selectedElm ? selectedElm.id : initialSelectedId;
    }
    return initialSelectedId;
  });

  const [localStatus, setLocalStatus] = useState(() => {
    const initialOption = options.find((opt) => opt.id === initialSelectedId);
    return initialOption ? initialOption.value : "";
  });

  const getDisplayValue = (option: DropdownOption) => {
    if (displayKey === "value") return option.value;
    return option[displayKey] || option.value;
  };

  // Reusable fetch function
  const fetchTicketData = async (
    refId: string,
    status: string,
    isMasterAdmin: boolean
  ): Promise<FetchTicketResult> => {
    if (isMasterAdmin) {
      return await updateSingleMasterTicket(refId, {
        ticketStatus: status,
        comment: "",
      });
    } else {
      return await updateUserTicketStatus(refId, status);
    }
  };

  const updateStatus = useCallback(
    async (status: string) => {
      // set Loading to true
      dispatch(setLoading(true));
      const updateTicket = await fetchTicketData(refId!, status, isMasterAdmin);

      dispatch(
        setMsg({
          success: updateTicket.success,
          message: updateTicket.message,
        })
      );

      if (updateTicket.success) {
        dispatch(setTicketUpdateData({ ...ticket, ticketStatus: status }));
      } else {
        // Revert local status if update fails
        setLocalStatus(ticket.ticketStatus);
        setSelected(
          options.find((opt) => opt.value === ticket.ticketStatus)?.id ||
            initialSelectedId
        );
      }
      dispatch(setLoading(false));
    },
    [dispatch, refId, ticket, options, initialSelectedId, isMasterAdmin]
  );

  const updateFlightClass = useCallback(
    (newValue: string) => {
      if (classIdx !== undefined) {
        dispatch(
          setTicketUpdateData({
            ...ticket,
            flightClasses: ticket.flightClasses.map(
              (flightClass: UserFlightClassResultType, idx: number) =>
                idx === classIdx
                  ? { ...flightClass, type: newValue }
                  : flightClass
            ),
          })
        );
      }
    },
    [dispatch, ticket, classIdx]
  );

  const updateBaggages = useCallback(
    (
      newValue: string,
      baggage:
        | "carryOnAllowed"
        | "carryOnWeight"
        | "checkedAllowed"
        | "checkedWeight"
    ) => {
      if (classIdx !== undefined) {
        const updatedFormData = {
          ...ticket,
          flightClasses: ticket.flightClasses.map(
            (classes: UserFlightClassResultType, idx: number) =>
              idx === classIdx
                ? {
                    ...classes,
                    [baggage]: parseInt(newValue),
                  }
                : classes
          ),
        };
        dispatch(setTicketUpdateData(updatedFormData));
      }
    },
    [dispatch, ticket, classIdx]
  );

  const handleClassOfferChange = (
    value: string,
    field: "name" | "available"
  ) => {
    const updatedFormData = {
      ...ticket,
      flightClasses: ticket.flightClasses.map(
        (classes: UserFlightClassResultType, i: number) =>
          i === classIdx
            ? {
                ...classes,
                type: classes.type || "economy",
                extraOffers: classes.extraOffers.map(
                  (offer: UserExtraOffersResultType, j: number) =>
                    j === offerIdx
                      ? {
                          ...offer,
                          [field]: value, // Update based on the passed field
                        }
                      : offer
                ),
              }
            : classes
      ),
    };

    // Dispatch the updated form state
    dispatch(setTicketUpdateData(updatedFormData));
  };

  const handleSelectionChange = (optionId: number) => {
    const selectedOption = options.find((opt) => opt.id === optionId);
    if (selectedOption) {
      setSelected(optionId);
      setLocalStatus(selectedOption.value);

      // Update ticket status
      if (isTicketStatus) {
        updateStatus(selectedOption.value);
      }
      // Update baggage dropdown
      else if (isBaggageDropdown && baggage) {
        updateBaggages(selectedOption.value, baggage);
      }
      // Update flight class type
      else if (classIdx !== undefined && offerIdx === undefined) {
        updateFlightClass(selectedOption.value);
      }
      // Update extra offers (name or available)
      else if (classIdx !== undefined && offerIdx !== undefined && field) {
        handleClassOfferChange(
          selectedOption.value,
          field as "name" | "available"
        );
      }

      // Trigger additional selection change logic if provided
      if (onSelectionChange) {
        onSelectionChange(selectedOption);
      }
    }
  };

  // Update local state if ticket status changes externally
  useEffect(() => {
    if (isTicketStatus && value !== localStatus) {
      setLocalStatus(value);
      setSelected(options.find((opt) => opt.value === localStatus)?.id!);
    }
  }, [
    ticket.ticketStatus,
    localStatus,
    options,
    initialSelectedId,
    isTicketStatus,
  ]);
  return (
    <Menu as="div" className="relative inline-flex w-full">
      {({ open }) => (
        <>
          <Menu.Button
            className="btn justify-between w-full min-h-[40px] border-0 text-opacity-70 dark:text-gray-200 dark:placeholder:text-gray-200 placeholder:text-opacity-70 bg-gray-50 dark:bg-gray-600 rounded-lg py-2 px-3 shadow dark:shadow-inner focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 no-arrows disabled:cursor-not-allowed"
            aria-label="Select option"
          >
            <span className="flex items-center capitalize">
              <span>
                {selected !== -1
                  ? getDisplayValue(
                      options.find((opt) => opt.id === selected) || options[0]
                    )
                  : placeholder}
              </span>
            </span>
            <svg
              className="shrink-0 ml-1 fill-current text-gray-400"
              width="11"
              height="7"
              viewBox="0 0 11 7"
            >
              <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
            </svg>
          </Menu.Button>
          <Transition
            className="z-10 absolute top-full left-0 w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-700 py-1.5 rounded shadow-lg overflow-hidden mt-1"
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Menu.Items className="font-medium text-sm text-gray-600 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none max-h-40 overflow-auto custom-scrollbar-logs">
              {options.map((option, optionIndex) => (
                <Menu.Item key={optionIndex}>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`flex items-center justify-between w-full py-2 px-3 cursor-pointer capitalize 

                      ${
                        active && option.value !== "expired"
                          ? "bg-gray-50 dark:bg-gray-900/20"
                          : ""
                      }
                      ${option.id === selected ? "text-red-500" : ""}
                      ${
                        option.value === "expired" ? "opacity-50" : ""
                      }                      
                      `}
                      style={{
                        cursor:
                          option.value === "expired"
                            ? "not-allowed"
                            : "pointer",
                      }}
                      onClick={() =>
                        option.value !== "expired" &&
                        handleSelectionChange(option.id)
                      }
                      disabled={option.value === "expired"} // Disable button when option is expired
                    >
                      <span>{getDisplayValue(option)}</span>
                      <svg
                        className={`shrink-0 mr-2 fill-current text-red-500 ${
                          option.id !== selected && "invisible"
                        }`}
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                      >
                        <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
                      </svg>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default ReusableDropdown;
