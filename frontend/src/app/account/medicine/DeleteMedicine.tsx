import React from 'react'

const DeleteMedicine = () => {
  return (
    <div className='flex flex-col gap-10 justify-center items-center my-10 '>
      <p className="text-xl">Are you sure you want to delete this medicine</p>
      <div className="flex gap-10">
        <button className="cursor-pointer bg-green-500 hover:bg-green-500/70 transition-all duration-500 px-7 py-2 rounded-md text-white flex items-center justify-center">Yes</button>
        <button className="cursor-pointer bg-red-500 hover:bg-red-500/70 transition-all duration-500 px-7 py-2 rounded-md text-white flex items-center justify-center">No</button>
      </div>
    </div>
  )
}

export default DeleteMedicine
