import React, { ChangeEventHandler, FocusEventHandler } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type TextareaType = {
  label: string;
  value?: string;
  placeHolder: string;
  error?: { message?: string };
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  require: boolean;
  register: UseFormRegisterReturn;
  name: string;
  readOnly?: boolean;
  disabled?: boolean;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
};
const Textarea = ({
  label,
  value,
  placeHolder,
  error,
  onChange,
  register,
  require,
  name,
  readOnly,
  disabled,
  onBlur,
}: TextareaType) => {
  return (
    <div className="z-20 w-full flex flex-col items-start gap-2.5 group ">
      { label ? (
        <label
          htmlFor={ name }
          className="text-sm lg:text-base text-primaryColor-100"
        >
          { label } { require && <span className="text-red-400 text-xl">*</span> }
        </label>
      ) : null }
      <textarea
        { ...register }
        disabled={ disabled }
        name={ name }
        value={ value }
        readOnly={ readOnly || false }
        id={ name }
        onChange={ onChange }
        onBlur={ onBlur }
        className={ ` text-primaryColor-100 w-full rounded-sm focus:outline-none focus:ring-0  px-4 md:px-5 py-3 placeholder:font-light placeholder:text-sm placeholder:font-sans bg-primaryBlack-medium ${error
          ? "border-red-400/60 border-[.5px] "
          : "border-[.5px]  border-gray-400/60 hover:border-gray-500 transition-all duration-500"
          }` }
        placeholder={ placeHolder }
      />
      <p
        className={ `transition-all duration-300  text-[13px] text-red-400/70 ${error ? "translate-y-0 " : "-z-10 opacity-0 -translate-y-1/2"
          }` }
      >
        { error?.message }
      </p>
    </div>
  );
};

export default Textarea;