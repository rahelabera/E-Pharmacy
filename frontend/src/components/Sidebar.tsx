"use client";
import Link from "next/link";
import React from "react";
import { IoBarChartOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineChatBubbleLeft, } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { PiPill } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { GrTransaction } from "react-icons/gr";
const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex fixed z-[100] flex-col gap-7 w-[15%] border-r-[1px] border-gray-200">
      <h2 className="text-2xl font-semibold text-black/80">
        My Pharmacy
      </h2>
      <div className="flex  flex-col gap-3">
        <Link
          href="/account/dashboard"
          className={ `flex pl-3 gap-2 items-center py-2 hover:bg-gray-200/80  ${pathname === "/account/dashboard"
            ? "border-primaryColor-100 border-r-[3.5px] bg-gray-200/80 "
            : null
            }` }
        >
          <IoBarChartOutline className="text-xl text-gray-400" />
          <span className="text-base">Dashboard</span>
        </Link>

        <Link
          href="/account/medicine"
          className={ `flex pl-3 transition-all duration-300 gap-2 items-center py-2 hover:bg-gray-200/80 ${pathname === "/account/medicine"
            ? "border-primaryColor-100 border-r-[3.5px] bg-gray-200/80"
            : null
            }` }
        >
          <PiPill className="text-xl text-gray-400" />
          <span className="text-base">Medicine</span>{ " " }
        </Link>
        <Link
          href="/account/orders"
          className={ `flex gap-2 pl-3 transition-all duration-300  items-center py-2 hover:bg-gray-200/80  ${pathname === "/account/orders"
            ? "border-primaryColor-100 border-r-[3.5px] bg-gray-200/80"
            : null
            }` }
        >
          { " " }
          <GrTransaction className="text-xl text-gray-400" />
          <span className="text-base">Orders</span>{ " " }
        </Link>

        <Link
          href="/account/chat"
          className={ `flex gap-2 pl-3  transition-all duration-300  items-center py-2 hover:bg-gray-200/80  ${pathname === "/account/chat"
            ? "border-primaryColor-100 border-r-[3.5px] bg-gray-200/80 "
            : null
            }` }
        >
          { " " }
          <HiOutlineChatBubbleLeft className="text-xl text-gray-400" />
          <span className="text-base">
            Chat
          </span>{ " " }
        </Link>
        <Link
          href="/account/adminstration"
          className={ `flex pl-3 gap-2 transition-all duration-300  items-center py-2 hover:bg-gray-200/80  ${pathname === "/account/adminstration"
            ? "border-primaryColor-100 border-r-[3.5px] bg-gray-200/80 "
            : null
            }` }
        >
          <RiAdminLine className="text-xl text-gray-400" />
          <span className="text-base">Adminstration</span>{ " " }
        </Link>
        <Link
          href="/account/profile"
          className={ `flex pl-3 gap-2 transition-all duration-300  items-center py-2 hover:bg-gray-200/80  ${pathname === "/account/profile"
            ? "border-primaryColor-100 border-r-[3.5px] bg-gray-200/80 "
            : null
            }` }
        >
          <IoSettingsOutline className="text-xl text-gray-400" />
          <span className="text-base">Profile</span>
        </Link>


      </div>
    </div>
  );
};

export default Sidebar;
