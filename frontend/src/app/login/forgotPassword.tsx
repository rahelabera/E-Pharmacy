"use client"
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address!"),
})

type forgotFormValues = z.infer<typeof forgotSchema>

const ForgotPassword = ({ setForgotPassword }: any) => {
  const { register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<forgotFormValues>({
    resolver: zodResolver(forgotSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit"
  })


  const onSubmit = (data: forgotFormValues) => {
    console.log(data);
  }

  const emailValue = watch("email");

  useEffect(() => {
    if (emailValue) clearErrors("email");
  }, [emailValue, clearErrors]);

  return (

    <div className="w-full max-w-md">
      <h2 className="text-2xl md:text-3xl font-black text-black/70 mb-8 text-center">Forgot Password</h2>
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
              className="mt-1 block w-full px-3 py-2 md:py-2.5 border border-gray-300 rounded-sm shadow-sm text-sm md:text-base focus:ring-0 focus:outline-none placeholder:text-xs"
              placeholder='example@gmail.com'
            />
            { errors.email && <p className="text-red-400 text-xs">{ errors.email.message }</p> }
          </div>
          <p onClick={ () => setForgotPassword(false) } className="mx-auto cursor-pointer text-primary-100">

            <span className="">Login</span>
          </p>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center text-sm md:text-base   py-2 md:py-2.5  px-4 border border-transparent rounded-sm shadow-sm  text-white bg-primary-100 hover:bg-primary=100/90 "
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;