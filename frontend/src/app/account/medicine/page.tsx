"use client"
import React, { useState } from 'react'
import MedicineTable from './MedicineTable'
import { IoIosSearch } from 'react-icons/io'
import Filter from '@/components/Filter'
import Link from 'next/link'

const page = () => {
  const [filter, setFilter] = useState<string[]>([]);
  return (
    <div className='w-11/12 mx-auto flex flex-col gap-5 '>
      <h1 className="font-semibold text-3xl text-black/70">Medicine Managment</h1>
      <div className="flex items-center justify-between gap-5 flex-wrap md:flex-nowrap">

        <div className="mt-1 flex items-center gap-2 w-1/3 px-3 py-1 md:py-1.5 border border-gray-300 rounded-sm text-sm md:text-base  "
        >
          <IoIosSearch className='text-black/80 text-lg' />
          <input
            type="text"
            className='focus:ring-0 focus:outline-none placeholder:text-sm placeholder:italic'
            placeholder='Search by medicine name'
          />
        </div>
        <div className="w-1/3">
          <Filter
            label="Filter By Category"
            number={ filter.length }
            data={ [
              {
                title: "Analgesics", name: "Analgesics",
              },
              { title: "Antivirals", name: "Antivirals" },
              { title: "Antibiotics", name: "Antibiotics" },
              { title: "Allergy Medications", name: "AllergyMedications" },
              { title: "Antidiabetic Drugs", name: "AntidiabeticDrugs" },
            ] }
            onChange={ setFilter }
          />
        </div>
        <Link href="/addMedicine" className='cursor-pointer text-white font-sans  bg-primary-100 px-10 py-2 text-base rounded'>Add a New Medicine</Link>

      </div>
      <MedicineTable />
    </div>
  )
}

export default page
