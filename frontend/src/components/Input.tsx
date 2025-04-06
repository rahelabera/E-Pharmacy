"use client";
import React, { useState, ChangeEvent, FocusEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
type InputType = {
  type: string;
  label: string;
  placeHolder: string;
  name: string;
  error?: { message?: string };
  register: UseFormRegisterReturn;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
};
const Input = ({
  type,
  label,
  value,
  placeHolder,
  error,
  register,
  required,
  name,
  readOnly,
  disabled,
  onBlur,
}: InputType) => {
  const [hide, setHide] = useState(true);

  const getInputType = () => {
    if (type === "password") {
      return hide ? "password" : "text";
    }
    return type;
  };
  return (
    <div className="w-full z-20 flex flex-col items-start gap-2.5 group ">
      { label ? (
        <label
          htmlFor={ name }
          className="text-sm lg:text-base text-gray-600"
        >
          { label } { required && <span className="text-red-400 text-xl">*</span> }
        </label>
      ) : null }
      <div
        className={ `text-primaryColor-200 flex items-center justify-between w-full rounded-sm focus:outline-none focus:ring-0  px-4 md:px-5 py-2
           placeholder:font-light placeholder:font-barlow ${error
            ? "border-red-400/60 border-[.5px] "
            : disabled
              ? "border-gray-300/60 border-[.5px] "
              : "border-[.5px]  border-gray-400/60 hover:border-gray-500 transition-all duration-500"
          }` }
      >
        <input
          inputMode={
            type as
            | "text"
            | "search"
            | "none"
            | "tel"
            | "url"
            | "email"
            | "numeric"
            | "decimal"
            | undefined
          }
          { ...register }
          disabled={ disabled }
          type={ getInputType() }
          name={ name }
          value={ value }
          readOnly={ readOnly || false }
          id={ name }
          onBlur={ onBlur }
          placeholder={ placeHolder }
          className={ `focus:outline-none  focus:ring-0 bg-transparent placeholder:font-light placeholder:text-sm w-full ${disabled && "text-gray-400"
            }` }
        />
        { type === "password" && (
          <div className="cursor-pointer " onClick={ () => setHide(!hide) }>
            { hide ? <FaEye /> : <FaEyeSlash /> }
          </div>
        ) }
      </div>

      <p
        className={ `transition-all duration-300 font-light text-[13px] text-red-400/90 ${error ? "translate-y-0 " : "-z-10 opacity-0 -translate-y-1/2"
          }` }
      >
        { error?.message }
      </p>
    </div>
  );
};

export default Input;