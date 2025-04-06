"use client";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-hidden">
      <div className="flex py-28 lg:py-20 w-11/12 mx-auto bg-secondaryColor-100 ">
        <div className="w-full">
          <Sidebar />
          <div className="lg:w-[90%] lg:ml-[15.75%]">{ children }</div>
        </div>
      </div>
      <div>
        <div className="hidden bg-black w-screen text-white py-3 lg:flex items-center  font-light">
          <div className="w-11/12 mx-auto flex justify-between">
            <Link href="/" className="uppercase font-serif">
              Prime Buy
            </Link>
            <p className="">All right reserved ©2024.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
