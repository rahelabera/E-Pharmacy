"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Google from "../../../public/google.svg"
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ForgotPassword from './forgotPassword';
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address!"),
  password: z.string().min(8, "Password must be at least 8 characters!")
})

type loginFormValues = z.infer<typeof loginSchema>

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit"
  })


  const onSubmit = (data: loginFormValues) => {
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
      { !forgotPassword ?
        <div className="w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-black text-black/80 mb-8 text-center">Login</h2>
          <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col gap-5">
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label htmlFor="email" className="block tfont-medium  text-gray-700 text-sm md:text-base ">
                  Email
                </label>
                <input
                  { ...register("email") }
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-3 py-2 md:py-2.5 border border-gray-300 rounded-sm text-sm md:text-base focus:ring-0 focus:outline-none placeholder:text-xs"
                  placeholder='example@gmail.com'
                />
                { errors.email && <p className="text-red-400 text-xs">{ errors.email.message }</p> }
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor="password" className="block  font-medium text-gray-700 text-sm md:text-base ">
                  Password
                </label>
                <div className="flex justify-between items-center mt-1 w-full px-3  py-2 md:py-2.5 border border-gray-300 rounded-sm  text-sm md:text-base ">

                  <input
                    { ...register("password") }
                    type={ showPassword ? "password" : "text" }
                    id="password"
                    placeholder='********'
                    className='w-full text-sm md:text-base focus:ring-0 focus:outline-none placeholder:text-xs'
                  />

                  { showPassword ?
                    <FaEye onClick={ () => setShowPassword(!showPassword) } />
                    :
                    <FaEyeSlash onClick={ () => setShowPassword(!showPassword) } />
                  }
                </div>
                { errors.password && <p className="text-red-400 text-xs">{ errors.password.message }</p> }
              </div>
              <p onClick={ () => setForgotPassword(true) } className="mx-auto cursor-pointer text-primary-100 text-sm">Forgot Password</p>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center text-sm md:text-base   py-2 md:py-2.5  px-4 border border-transparent rounded-sm text-white bg-primary-100 hover:bg-primary-100/90 "
            >
              Login
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-sm text-gray-500">or</span>
            <hr className="w-full border-gray-300" />
          </div>
          <button
            type="button"
            className="mt-6 w-full flex gap-2 justify-center  py-2 md:py-2.5  px-4 border border-gray-300 rounded-sm text-sm md:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 "
          >
            <Image src={ Google } alt='google icon' className='w-5' />Login with Google
          </button>
          <p className="mt-6 text-center text-sm text-gray-500">
            If you don't have an account?{ ' ' }
            <Link href="/signup" legacyBehavior>
              <a className="text-primary-100 hover:underline">Sign up</a>
            </Link>
          </p>
        </div>
        :
        <ForgotPassword setForgotPassword={ setForgotPassword } /> }
    </div>
  );
};

export default Page;