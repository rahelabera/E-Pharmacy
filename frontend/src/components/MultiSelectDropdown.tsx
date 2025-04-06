"use client";
import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";


const MultiSelectDropdown = ({ register, error, setValue }: any) => {
  const installments = ["Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday", "Sunday"];
  const [selectedInstallment, setSelectedInstallment] = useState<Record<string, boolean>>(
    installments.reduce((obj, installment) => ({ ...obj, [installment]: false }), {})
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const numberOfSelectedInstallments = Object.values(selectedInstallment).filter(Boolean).length;
  const [openDropdown, setOpenDropdown] = useState(false);

  // Function to update the selected installments and set the form value
  const handleCheckboxChange = (installment: string, isChecked: boolean) => {
    setSelectedInstallment((prev) => {
      const updated: Record<string, boolean> = { ...prev, [installment]: isChecked };

      // Get the array of selected installments
      const selectedArray = Object.keys(updated)
        .filter((key) => updated[key]) // Filter keys where the value is true


      // Update the form value using setValue
      setValue("daysOpen", selectedArray, { shouldValidate: true });
      return updated;
    });
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ dropdownRef } className="relative">
      <div className="flex flex-col gap-2">
        <p className="block text-md text-gray-600">Days Open:</p>
        <div
          onClick={ () => setOpenDropdown((prev) => !prev) }
          className="flex text-gray-500 cursor-pointer justify-between items-center text-sm w-full px-5 py-2 bg-transparent rounded-md border-[.5px]  border-gray-400/60 focus:outline-none   placeholder:text-sm"
        >
          { numberOfSelectedInstallments > 0
            ? `${numberOfSelectedInstallments} Selected`
            : "-- Select Open Days --" }

          <MdKeyboardArrowDown
            className={ `transition-all duration-300 text-2xl ${openDropdown ? "-rotate-180" : "rotate-0"}` }
          />
        </div>
      </div>
      { openDropdown && (
        <div className="absolute z-[1000] shadow-4 py-2 top-full w-full flex flex-col gap-3 rounded-b-md bg-white dark:bg-meta-4">
          { installments.map((installment: string) => (
            <fieldset
              key={ installment }
              className={ `${selectedInstallment[installment] && "bg-blue-400/70 dark:text-white"
                } flex items-center gap-2 transition-all duration-300 hover:bg-blue-500 hover:text-whiten cursor-pointer px-4 py-2` }
            >
              <input
                type="checkbox"
                className="cursor-pointer"
                { ...register }
                checked={ selectedInstallment[installment] }
                onChange={ (e) => handleCheckboxChange(installment, e.target.checked) }
                name="paymentInstallment"
                value={ installment }
                id={ `paymentInstallment-${installment}` }
              />
              <label className="cursor-pointer text-gray-800" htmlFor={ `paymentInstallment-${installment}` }>{ installment }</label>
            </fieldset>
          )) }
        </div>
      ) }
      { error && !openDropdown && (
        <p className="w-full text-red text-sm">
          { error.message }
        </p>
      ) }
    </div>
  );
};

export default MultiSelectDropdown;
