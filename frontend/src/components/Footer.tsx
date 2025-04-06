"use client"
import Image from 'next/image'
import React from 'react'
import Logo from '../../public/footer logo.svg'
import { usePathname } from 'next/navigation'
const Footer = () => {
  const pathname = usePathname()

  return (
    <div className="">
      { !pathname.startsWith("/account") ?
        < div className='bg-primary-100 text-white text-center py-4' >
          <div className="w-11/12 mx-auto">
            <div className="flex flex-col gap-2">

              <Image src={ Logo } alt='logo' className='w-20 md:w-24 ' />
              <p className='font-thin text-sm md:text-base text-left w-4/5 md:w-3/5'>Join us in transforming the way medicines are sold and delivered, ensuring convenience, transparency, and better healthcare for all</p >
            </div>
            <p className='flex justify-center mx-auto pt-7 md:pt-10 font-thin text-xs md:text-sm text-left'>© 2025 Pill Link. All rights reserved.</p>
          </div>
        </div > : null }
    </div>
  )
}

export default Footer
