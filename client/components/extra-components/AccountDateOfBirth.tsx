import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import { useState } from "react";
import dayjs from "dayjs";

const AccountDateOfBirth = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <div className="w-full">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateField
          className="custom-date-field w-full dark:bg-slate-900/30"
          value={dayjs(value)}
          onChange={(newValue: any) => {
            setValue(moment(new Date(newValue)).format("M/D/YYYY"));
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default AccountDateOfBirth;
