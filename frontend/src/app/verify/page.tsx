"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { z } from 'zod'
const verifySchema = z.object({
  otp: z.string().min(1, "OTP is required"),
  password: z.string().min(8, "Password must be at least 8 characters!"),
  confirmPassword: z.string().min(8, "Confirm Password is required!")

}
).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // This sets the error on the confirmPassword field
});
type verifyFormValues = z.infer<typeof verifySchema>

const Page = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<verifyFormValues>({
    resolver: zodResolver(verifySchema),
    mode: "onBlur",
    reValidateMode: "onSubmit"
  })

  const onSubmit = (data: verifyFormValues) => {
    console.log(data);
  }

  const emailValue = watch("otp");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  useEffect(() => {
    if (emailValue) clearErrors("otp");
    if (passwordValue) clearErrors("password");
    if (confirmPasswordValue) clearErrors("confirmPassword");
  }, [emailValue, passwordValue, confirmPasswordValue, clearErrors]);

  return (
    <div className="flex items-center justify-center font-sans pt-14">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-2.5 mb-5  items-center">
          <h2 className="text-2xl md:text-3xl font-black text-black/80 mb-8 text-center">Reset Password</h2>
          <p className="text-center text-gray-500 text-sm">
            We've sent an OTP to your email. Please check your inbox for the OTP and enter it to reset your password.
          </p>
        </div>
        <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col gap-7">
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="otp" className="block font-medium  text-gray-700 text-sm md:text-base ">
                OTP
              </label>
              <input
                { ...register("otp") }
                type="otp"
                id="otp"
                className="mt-1 block w-full px-3 py-2 md:py-2.5 border border-gray-300 rounded-sm shadow-sm text-sm md:text-base focus:ring-0 focus:outline-none placeholder:text-xs"
                placeholder='485950'
              />
              { errors.otp && <p className="text-red-400 text-xs">{ errors.otp.message }</p> }
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="password" className="block font-medium text-gray-700">
                New Password
              </label>
              <div className="flex justify-between items-center mt-1  w-full px-3  py-2 md:py-2.5 border border-gray-300 rounded-sm shadow-sm text-sm md:text-base ">

                <input
                  { ...register("password") }
                  type={ showPassword ? "password" : "text" }
                  id="password"
                  placeholder='********'
                  className=' text-sm w-full md:text-base focus:ring-0 focus:outline-none placeholder:text-xs'
                />
                { showPassword ?
                  <FaEye onClick={ () => setShowPassword(!showPassword) } />
                  :
                  <FaEyeSlash onClick={ () => setShowPassword(!showPassword) } />
                }
              </div>
              { errors.password && <p className="text-red-400 text-xs">{ errors.password.message }</p> }
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="confirmPassword" className="block  font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="flex justify-between items-center mt-1  w-full px-3  py-2 md:py-2.5 border border-gray-300 rounded-sm shadow-sm text-sm md:text-base ">

                <input
                  { ...register("confirmPassword") }
                  type={ showPassword ? "password" : "text" }
                  id="confirmPassword"
                  placeholder='********'
                  className=' text-sm  w-full md:text-base focus:ring-0 focus:outline-none placeholder:text-xs'
                />
                { showPassword ?
                  <FaEye onClick={ () => setShowPassword(!showPassword) } />
                  :
                  <FaEyeSlash onClick={ () => setShowPassword(!showPassword) } />
                }
              </div>
              { errors.confirmPassword && <p className="text-red-400 text-xs">{ errors.confirmPassword.message }</p> }
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center text-sm md:text-base   py-2 md:py-2.5  px-4 border border-transparent rounded-sm shadow-sm  text-white bg-primary-100 hover:bg-primary-100/90 "
          >
            Submit
          </button>
        </form>


      </div>

    </div>
  )
}

export default Page
