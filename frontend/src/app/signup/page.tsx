"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Google from "../../../public/google.svg"
import Image from 'next/image';
import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const signUpSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address!"),
  password: z.string().min(8, "Password must be at least 8 characters!")
}

)
type signUpFormValues = z.infer<typeof signUpSchema>


const Page = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<signUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit"
  })

  const onSubmit = (data: signUpFormValues) => {
    console.log(data);
  }

  const emailValue = watch("email");
  const passwordValue = watch("password");

  useEffect(() => {
    if (emailValue) clearErrors("email");
    if (passwordValue) clearErrors("password");
  }, [emailValue, passwordValue, clearErrors]);

  return (
    <div className="flex items-center justify-center font-sans py-14">

      <div className="w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-black text-black/70 mb-8 text-center">Sign Up</h2>
        <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col gap-10">
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="email" className="block font-medium  text-gray-700 text-sm md:text-base ">
                Email
              </label>
              <input
                { ...register("email") }
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 md:py-2.5 border border-gray-300 rounded-sm shadow-sm text-sm md:text-base focus:ring-0 focus:outline-none placeholder:text-xs"
                placeholder='example@gmail.com'
              />
            </div>
            { errors.email && <p className="text-red-400 text-xs">{ errors.email.message }</p> }

            <div className='flex flex-col gap-2'>
              <label htmlFor="password" className="block  font-medium text-gray-700">
                Password
              </label>
              <div className="flex justify-between items-center mt-1 w-full px-3  py-2 md:py-2.5 border border-gray-300 rounded-sm shadow-sm text-sm md:text-base ">

                <input
                  { ...register("password") }
                  type={ showPassword ? "password" : "text" }
                  id="password"
                  placeholder='********'
                  className=' text-sm md:text-base focus:ring-0 focus:outline-none placeholder:text-xs'
                />
                { showPassword ?
                  <FaEye onClick={ () => setShowPassword(!showPassword) } />
                  :
                  <FaEyeSlash onClick={ () => setShowPassword(!showPassword) } />
                }
              </div>
            </div>
            { errors.password && <p className="text-red-400 text-xs">{ errors.password.message }</p> }
          </div>
          <button
            type="submit"
            className="w-full flex justify-center text-sm md:text-base   py-2 md:py-2.5  px-4 border border-transparent rounded-sm shadow-sm  text-white bg-primary-100 hover:bg-primary-100/90 "
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-sm text-gray-500">or</span>
          <hr className="w-full border-gray-300" />
        </div>
        <button
          type="button"
          className="mt-6 w-full flex gap-2 justify-center  py-2 md:py-2.5  px-4 border border-gray-300 rounded-sm shadow-sm text-sm md:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 "
        >
          <Image src={ Google } alt='google icon' className='w-5' /> Sign Up with Google
        </button>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{ ' ' }
          <Link href="/login" legacyBehavior>
            <a className="text-primary-100 hover:underline ">Log in</a>
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Page;