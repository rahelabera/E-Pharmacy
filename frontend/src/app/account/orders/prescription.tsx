import Link from 'next/link'
import React from 'react'
import PictureThree from "../../../../public/pharma1.jpg"
import Id from "../../../../public/id.jpg"
import Presc from "../../../../public/presc_temp.webp"
import Image from 'next/image'
const Prescription = () => {
  return (
    <div className=" py-10 px-5 ">

      <h1 className='text-2xl font-bold text-center'>Prescription</h1>
      <div className='flex flex-col justify-start items-start'>
        <div className="flex w-full flex-col items-start">
          <div className="flex gap-2 items-center justify-center ">
            <div
              className="flex text-xl justify-center items-center font-sans bg-primary-100 text-white uppercase cursor-pointer rounded-full w-10 h-10 md:w-14 md:h-14 object-cover" >
              b
            </div>
            <Link href="/" className="">@Betelhem</Link>
          </div>
          <div className="flex gap-5 items-center justify-center my-5">
            <Image src={ PictureThree } className="w-28 h-20 object-cover rounded-md" alt="medicine" />
            <div className="text-gray-900">
              <p className="text-lg font-semibold">Tylanol</p>
              <p className="text-sm">$56.7</p>
              <p className="text-sm">500g</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-14">
          <Image src={ Id } className="w-full object-cover rounded-md" alt="medicine" />
          <Image src={ Presc } className="w-full object-cover rounded-md" alt="medicine" />
        </div>
      </div>
      <div className="md:w-1/2 mx-auto flex  items-end justify-end my-5 gap-7">

        <button
          type="submit"
          className="w-full mx-auto  flex justify-center text-sm md:text-base   py-2 md:py-2.5  px-4 border border-transparent rounded-sm shadow-sm  text-white bg-green-500 hover:bg-green-500/90 "
        >
          Approve
        </button>
        <button
          type="submit"
          className="w-full mx-auto flex justify-center text-sm md:text-base   py-2 md:py-2.5  px-4 border border-transparent rounded-sm shadow-sm  text-white bg-red-400 hover:bg-red-400/90 "
        >
          Reject
        </button>
      </div>
    </div>
  )
}

export default Prescription
