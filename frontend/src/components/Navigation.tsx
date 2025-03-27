import React from 'react'
import Logo from '../../public/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
const Navigation = () => {
  return (
    <div className='w-11/12 mx-auto max-w-[1440px] flex justify-between items-center py-4'>
      <div className='text-primary-100'>
        <Link href='/'>
          <Image src={ Logo } alt='logo' className='w-24 ' />
        </Link>
      </div>
      <div className='flex space-x-4'>
        <Link href="/signup" className='text-white bg-primary-100 px-7 py-2 rounded-full'>Register</Link>

      </div>

    </div>
  )
}

export default Navigation
