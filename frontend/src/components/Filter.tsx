import React, { RefObject, useEffect, useRef, useState } from "react";
import { GoFilter, GoSortAsc, GoTag } from "react-icons/go";

type DropDownType = {
  label: string;
  header?: string;
  number: number;
  data: { name: string; title: string; icons?: any }[];
  onChange: (update: (prev: string[]) => string[]) => void;
};

const Filter = ({ label, data, onChange, number }: DropDownType) => {
  const [showList, setShowList] = useState(false);
  const divEl = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!divEl.current) {
        return;
      }
      if (!divEl.current.contains(event.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
  const handleChange = (name: string, checked: boolean) => {
    onChange((prev) => {
      if (checked) {
        // Add the value when checked
        return [...prev, name];
      } else {
        // Remove the value when unchecked
        return prev.filter((item) => item !== name);
      }
    });
  };

  return (
    <div
      ref={ divEl }
      onClick={ () => setShowList((prev) => !prev) }
      className="w-full flex flex-col items-center gap-2.5 group"
    >
      <button
        data-dropdown-toggle="dropdown"
        className="w-full text-gray-700 border-[.5px] border-gray-300 rounded-sm px-2 md:px-3 py-1.5 focus:outline-none text-sm text-center flex items-start justify-between relative gap-4 capitalize group"
        type="button"
      >
        <div className="w-full z-30 flex items-center justify-between relative gap-2 lg:gap-3  ">
          <span className="flex gap-2 lg:gap-3 items-center text-sm md:text-base">
            { label.startsWith("Sort") ? (
              <GoSortAsc className="text-lg md:text-xl" />
            ) : label.startsWith("Filter") ? (
              <GoFilter className="text-lg md:text-xl" />
            ) : (
              <GoTag className="text-lg md:text-xl" />
            ) }
            { number !== 0 ? `${number} Selected` : label }
          </span>
          <div className={ `${showList ? "rotate-180" : ""}` }>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
        <div
          id="dropdown"
          className={ `z-[5000] w-full text-sm font-medium text-gray-900 border border-gray-200 
           absolute top-full left-0 bg-white  mt-1 rounded shadow ${showList ? " visible opacity-100" : "invisible opacity-0"
            }` }
        >
          <ul>
            { data.map(({ title, name }, idx) => {
              return (
                <li
                  key={ idx }
                  className="w-full border-b border-gray-200 rounded-t-lg "
                >
                  <div className="flex items-center ps-3">
                    <input
                      id={ name }
                      type="checkbox"
                      value={ name }
                      onChange={ (e) => handleChange(name, e.target.checked) } // Handle checkbox change
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-0"
                    />
                    <label
                      htmlFor={ name }
                      className="w-full py-3 ms-2 text-xs md:text-sm font-medium text-gray-900"
                    >
                      <div className="lg:px-3 flex gap-2 capitalize text-xs md:text-sm relative cursor-pointer z-10 transition-all bg-[-100%] duration-500 text-primaryColor-200 hover:text-primary-100">
                        { title }
                      </div>
                    </label>
                  </div>
                </li>
              );
            }) }
          </ul>
        </div>
      </button>
    </div>
  );
};

export default Filter;