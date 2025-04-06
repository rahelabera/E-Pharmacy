'use client'
import Input from '@/components/Input'
import MultiSelectDropdown from '@/components/MultiSelectDropdown'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Page = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const pharmacySchema = z.object({
    pharmacyName: z.string().min(2, "Pharmacy name is required"),
    ownerName: z.string().min(2, "Owner name is required"),

    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    address: z.string().min(5, "Address is required"),
    openingTime: z.string().optional(),
    closingTime: z.string().optional(),
    daysOpen: z.array(z.string()).optional(),
    website: z.string().optional(),
    licenseFile: z.any().refine((file) => file?.length === 1, "Please Upload Your licence"),
    // terms: z.boolean().refine((val) => val === true, "You must accept terms"),
  });

  type pharmacyValues = z.infer<typeof pharmacySchema>
  const { register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<pharmacyValues>({
    resolver: zodResolver(pharmacySchema),
    mode: "onBlur",
    reValidateMode: "onSubmit"
  })


  const onSubmit = (data: pharmacyValues) => {
    console.log(data);
  }
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && value[name as keyof pharmacyValues]) {
        clearErrors(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);
  console.log(errors, "errors")
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const image = URL.createObjectURL(file);
      setImageUrl(image);
    };
  }
  return (
    <div className='md:w-11/12 lg:w-9/12 mx-auto max-w-[1440px] my-10 py-10 px-10 bg-white shadow-xl rounded-lg'>
      <h1 className="flex justify-center mx-auto font-sans font-semibold text-xl md:text-3xl text-black/70">Pharmacy  Verification </h1>
      <form onSubmit={ handleSubmit(onSubmit) } className="">
        <div className="my-10 flex flex-col items-center gap-2">

          <div className=" flex items-center justify-center w-full">
            <label htmlFor="licenseFile" className="flex flex-col items-center justify-center w-full md:w-1/2 h-54 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100">
              { !imageUrl ?
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload your license</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                :
                <Image className='w-24 h-auto object-cover' src={ imageUrl } alt="selected Image" width={ 100 } height={ 100 } /> }
              <input onChange={ handleFileChange } id="licenseFile" type="file" className="hidden" />
            </label>
          </div>
          { errors.licenseFile && (
            <p
              className={ `transition-all duration-300 font-light text-[13px] text-red-400/90 ${errors.licenseFile ? "translate-y-0 " : "-z-10 opacity-0 -translate-y-1/2"
                }` }
            >
              { typeof errors.licenseFile?.message === 'string' && errors.licenseFile.message }
            </p>) }
        </div>

        <div className=" mx-auto grid grid-cols-1  md:grid-cols-2 gap-5">

          <Input
            type="text"
            label="Pharmacy Name:"
            placeHolder="Enter Pharmacy Name"
            register={ register("pharmacyName") }
            error={ errors.pharmacyName }
            required={ true }
            name="pharmacyName"
          />

          <Input
            type="text"
            label="Owners Name:"
            placeHolder="Enter Owners Name"
            register={ register("ownerName") }
            error={ errors.ownerName }
            required={ true }
            name="ownerName"
          />

          <Input
            type="text"
            label="Phone:"
            placeHolder="Enter Phone Number"
            register={ register("phone") }
            error={ errors.phone }
            required={ true }
            name="phone"
          />
          <div className="flex flex-col items-start">

            <Input
              type="text"
              label="Location:"
              placeHolder="Enter Location Link"
              register={ register("address") }
              error={ errors.address }
              required={ true }
              name="address"
            />
            <p className="text-sm font-light text-gray-500">Please insert you addresss link from google map.</p>
          </div>
          <Input
            type="text"
            label="Website:"
            placeHolder="Enter website link"
            register={ register("website") }
            error={ errors.website }
            required={ false }
            name="website"
          />
          <MultiSelectDropdown error={ errors.daysOpen } register={ register("daysOpen") } setValue={ setValue } />
          <Input
            type="time"
            label="Open Time:"
            placeHolder="Enter website link"
            register={ register("openingTime") }
            error={ errors.openingTime }
            required={ false }
            name="openingTime"
          />
          <Input
            type="time"
            label="Closing Time:"
            placeHolder="Enter website link"
            register={ register("closingTime") }
            error={ errors.closingTime }
            required={ false }
            name="closingTime"
          />

        </div>
        <button
          type="submit"
          className="w-full md:w-1/3 mx-auto mt-5 flex justify-center text-sm md:text-base   py-2 md:py-2.5  px-4 border border-transparent rounded-sm shadow-sm  text-white bg-primary-100 hover:bg-primary-100/90 "
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default Page
