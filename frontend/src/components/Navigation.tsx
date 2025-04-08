"use client"
import React, { RefObject, useEffect, useRef, useState } from 'react'
import Logo from '../../public/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import NavDropdown from './NavDropdown'
import { IoMdNotifications } from 'react-icons/io'
const Navigation = () => {
  const [showNotification, setShowNotification] = useState(false);
  const divEl = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!divEl.current) {
        return;
      }
      if (!divEl.current.contains(event.target as Node)) {
        setShowNotification(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showNotification]);
  return (
    <div className='w-11/12 mx-auto max-w-[1440px] flex justify-between items-center py-4'>
      <div className='text-primary-100'>
        <Link href='/'>
          <Image src={ Logo } alt='logo' className='w-24 ' />
        </Link>
      </div>
      {/* <div className='flex space-x-4'>
        <Link href="/signup" className='text-white bg-primary-100 px-7 py-2 rounded-full'>Register</Link>

      </div> */}
      <div className="flex items-center gap-10">


        <div ref={ divEl } className="relative ">
          <div className="relative group w-10 h-10 rounded-full flex items-center justify-center bg-slate-200">
            <IoMdNotifications onClick={ () => setShowNotification(!showNotification) } className='group-hover:text-primary-100 text-2xl text-black/60 cursor-pointer' />
            <div className="absolute -top-2 -right-2 flex justify-center items-center bg-red-400 text-white text-sm w-5 h-5 rounded-full">3</div>
          </div>
          { showNotification && (
            <div className="z-[400] p-5 absolute top-10 right-0 rounded-md shadow-lg bg-white h-[15rem] w-[18rem]">
              Notification
            </div>
          ) }
        </div>
        <NavDropdown
          data={ [
            { name: "DashBoard", pathname: "/account/dashboard" },
            { name: "Medicine", pathname: "/account/medicine" },
            { name: "Orders", pathname: "/account/orders" },
            { name: "Chat", pathname: "/account/chat" },
            { name: "Adminstration", pathname: "/account/adminstration" },
            { name: "Profile", pathname: "/account/profile" },
            { name: "logout", pathname: "/logout" },
          ] }
        />

      </div>
    </div>
  )
}

export default Navigation
