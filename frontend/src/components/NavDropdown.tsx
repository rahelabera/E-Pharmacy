"use client"
import React, {
  useEffect,
  useRef,
  useState,
  RefObject,
} from "react";
import Link from "next/link";

type Datatype = {
  data: {
    name: string;
    pathname: string;
  }[];
};
// Define the types for user data and the context
interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  // Add any other fields based on your user model
}


const NavDropDown = ({ data }: Datatype) => {
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
  }, [showList]);


  return (
    <div ref={ divEl } className="relative bg-white">
      <div className="flex gap-2 items-end justify-end ">

        <div
          onClick={ () => setShowList(!showList) }
          className="flex text-xl justify-center items-center font-sans bg-primary-100 text-white uppercase cursor-pointer rounded-full w-10 h-10 md:w-14 md:h-14 object-cover"
        >
          b
        </div>

      </div>
      <div
        id="dropdown"
        className={ `z-[50] w-[12rem]
          
           absolute top-full right-0 bg-white text-black/70 mt-1 rounded shadow py-3   ${showList ? " visible opacity-100" : "invisible opacity-0"
          }` }
      >
        <ul
          className=" text-sm text-center  max-h-[25rem] overflow-y-auto"
          aria-labelledby="dropdownDefaultButton"
        >
          { data.map((item, idx) => {
            if (item.name !== "logout") {
              return (
                <Link href={ `${item.pathname}` } key={ idx }>
                  <li>
                    <p
                      onClick={ () => setShowList(false) }
                      className="capitalize py-1 text-sm md:text-base relative cursor-pointer z-10 hover:bg-white text-black/70 hover:text-primary-100 transition-all duration-300"
                    >
                      { item.name }
                    </p>
                  </li>
                </Link>
              );
            } else {
              return (
                <div key={ idx }>
                  <p className="capitalize py-1 text-primaryColor-200 text-sm md:text-base relative cursor-pointer z-10 transition-all hover:bg-white">
                    { item.name }
                  </p>
                </div>
              );
            }
          }) }
        </ul>
      </div>
    </div>
  );
};

export default NavDropDown;
