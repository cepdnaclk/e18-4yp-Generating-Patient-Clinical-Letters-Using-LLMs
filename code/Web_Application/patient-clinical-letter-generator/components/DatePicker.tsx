import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DatePickerProps } from "./Props";

const MyDatePicker: React.FC<DatePickerProps> = (props, { outlineColor }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!props.selectedDate) {
      setSelectedDate(new Date());
    } else {
      setSelectedDate(props.selectedDate);
    }
  }, [props.selectedDate]);

  return (
    <div className="data-time-show bg-slate-700 h-fit px-2 py-1 rounded-md">
      {props.type === "history" ? (
        <label className="text-black">{props.labelName}</label>
      ) : (
        <label className="text-white">{props.labelName}</label>
      )}

      <DatePicker
        selected={selectedDate}
        onChange={(date: Date) => props.onDateChange(date)}
        dateFormat="dd/MM/yyyy"
        className="custom-datepicker bg-slate-700 text-white rounded px-2 py-1 outline outline-2 text-sm text-center outline-slate-600"
        // className={`custom-datepicker bg-slate-700 text-white rounded px-2 py-1 outline outline-2 text-sm text-center outline-slate-${outlineColor}`}
      />
    </div>
  );
};

export default MyDatePicker;
