"use client"
import React, { useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import Filter from '@/components/Filter'
import Link from 'next/link'
import OrdersTable from '../dashboard/OrdersTable'

const page = () => {
  const [filter, setFilter] = useState<string[]>([]);
  return (
    <div className='w-11/12 mx-auto flex flex-col gap-5 '>
      <h1 className="font-semibold text-3xl text-black/70">Orders Managment</h1>
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
        <div className="w-1/3">
          <Filter
            label="Filter By Status"
            number={ filter.length }
            data={ [
              {
                title: "Pending", name: "pending",
              },
              { title: "Verfied", name: "verified" },
              { title: "Reject", name: "reject" },

            ] }
            onChange={ setFilter }
          />
        </div>

      </div>
      <OrdersTable />
    </div>
  )
}

export default page
