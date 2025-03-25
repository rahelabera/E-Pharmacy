import Image from "next/image";
import PictureOne from "../../public/pharma1.jpg"
import PictureTwo from "../../public/pharma2.jpg"
import PictureThree from "../../public/pharma3.jpg"
import PictureFour from "../../public/pexels-anntarazevich-5910953.jpg"
import PictureFive from "../../public/pexels-karolina-grabowska-4021813.jpg"
import PictureSix from "../../public/pexels-shvetsa-3683042.jpg"
import SignUp from "../../public/sign-up-application-svgrepo-com.svg"
import Sell from "../../public/earning-points-salary-svgrepo-com.svg"
import List from "../../public/claim-rewards-svgrepo-com.svg"
import Steps from "../../public/steps.svg"
import Link from "next/link";
export default function Home() {
  return (
    <div className="mx-auto font-sans max-w-[1440px] py-4">
      <div className="w-11/12 mx-auto py-14 md:py-10 flex flex-col md:flex-row gap-10 justify-center items-center">
        <div className="md:w-[65%] flex flex-col items-start gap-4 md:gap-7">
          <div className="flex flex-col gap-2 md:gap-4">
            <h1 className="text-black/80 text-3xl md:text-4xl lg:text-5xl  font-black font-sans">Expand Your Pharmacy, Reach
              <span className="text-primary-100">
                { " " }  More  Customers
              </span>
            </h1>
            <p className="text-black/50 font-mono md:w-3/4">Join a platform designed for pharmacy owners and independent medicine sellers. List your products, verify your pharmacy, and connect with buyers in need of essential medicines.</p>
          </div>
          <Link href="/signup" className='cursor-pointer text-white font-mono text-lg bg-primary-100 px-10 py-2 rounded-full'>Register</Link>
        </div>
        <div className="md:w-[45%] p-3 grid grid-cols-3 gap-2 overflow-hidden rounded-xl auto-rows-fr">
          <Image className="w-full hover:scale-105 transition-all duration-300  h-32 object-cover rounded-xl" src="/pillsFour.jpg" alt="hero" width={ 500 } height={ 500 } />
          <Image className="w-full hover:scale-105 transition-all duration-300  h-32 object-cover rounded-xl" src="/pillsThree.jpg" alt="hero" width={ 500 } height={ 500 } />
          <Image className="w-full hover:scale-105 transition-all duration-300  h-full row-span-2 object-cover rounded-xl" src="/pillsFive.jpg" alt="hero" width={ 500 } height={ 500 } />
          <Image className="w-full hover:scale-105 transition-all duration-300  h-32 object-cover rounded-xl" src="/pillsTwo.jpg" alt="hero" width={ 500 } height={ 500 } />
          <Image className="w-full hover:scale-105 transition-all duration-300  h-32 object-cover rounded-xl" src="/pillsSix.jpg" alt="hero" width={ 500 } height={ 500 } />
          <Image className="w-full hover:scale-105 transition-all duration-300  h-32 object-cover rounded-xl" src="/pillsSeven.jpg" alt="hero" width={ 500 } height={ 500 } />
          <Image className="w-full hover:scale-105 transition-all duration-300  h-32 object-cover rounded-xl" src="/pills.jpg" alt="hero" width={ 500 } height={ 500 } />
          <Image className="w-full hover:scale-105 transition-all duration-300  h-32 object-cover rounded-xl" src="/pillsEight.jpg" alt="hero" width={ 500 } height={ 500 } />
        </div>
      </div>
      <div className="bg-primary-200 py-10 md:py-14">
        <div className="w-11/12 md:w-8/12 lg:w-7/12 mx-auto flex flex-col iitems-center gap-2 md:gap-3 lg:gap-5">
          <h2 className="text-xl md:text-2xl lg:text-3xl text-center font-black text-black/75">Empowering Medicine Sellers, Simplifying Healthcare</h2>
          <p className="text-black/50 text-center text-sm sm:text-base">We provide a seamless platform for pharmacies and independent sellers to list and sell medicines online. Our mission is to ensure accessibility, transparency, and convenience for both sellers and buyers.</p>
        </div>
        <div className="w-11/12 mx-auto flex flex-col md:flex-row gap-8 pt-8 md:pt-16">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <Image className="w-8 md:w-10" src="/world.svg" width={ 40 } height={ 40 } alt="world icon" />
              <h3 className="font-bold text-black/80 text-center">Expand Your Reach </h3>
            </div>
            <p className="text-sm text-center text-black/50">By joining the platform, your pharmacy gets access to a wider audience beyond your local area. Customers looking for medicines can discover your store online, increasing visibility and potential sales.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <Image className="w-8 md:w-10" src="/box.svg" width={ 40 } height={ 40 } alt="world icon" />
              <h3 className="font-bold text-black/80 text-center">Easily Manage Inventory </h3>
            </div>
            <p className="text-sm text-center text-black/50">Keep track of your stock effortlessly with a digital inventory system. Update available medicines, receive low-stock alerts, and manage orders seamlessly.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <Image className="w-8 md:w-10" src="/medicine.svg" width={ 40 } height={ 40 } alt="world icon" />
              <h3 className="font-bold text-black/80 text-center">Help More Patients  </h3>
            </div>
            <p className="text-sm text-center text-black/50">By listing your pharmacy online, you're making it easier for people—especially those in remote areas or with mobility issues—to get the medications they need.</p>
          </div>
        </div>
      </div>
      {/* how it works */ }
      <div className="w-11/12 md:10/12 lg:w-8/12 mx-auto  flex flex-col  gap-10 py-10">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl md:text-2xl  font-black text-black/80">How It Works</h1>
          {/* Desktop Layout */ }
          <div className="hidden md:flex gap-3 md:gap-5 lg:gap-10 pt-10 items-start">
            <div className="flex-col gap-10">
              <div className="flex flex-col items-center gap-16 ">
                <Image className="w-32 lg:w-40" src={ SignUp } width={ 40 } height={ 40 } alt="world icon" />
                <div className="flex items-end flex-col gap-1.5">
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-primary-100 text-white flex justify-center w-7 h-7 text-sm items-center rounded-full">2</span>
                    <h3 className="md:text-lg font-black font-sans text-black/70">List Your Products</h3>
                  </div>
                  <p className="text-right text-sm md:text-base text-black/50 ">  Easily upload your medicines and healthcare products with detailed descriptions, pricing, and availability. Our intuitive dashboard helps you manage your inventory effortlessly</p>
                </div>
                <div className="">
                </div>
              </div>
              <div className="flex flex-col items-center gap-10 ">
                <Image className="w-32 lg:w-40" src={ List } width={ 40 } height={ 40 } alt="world icon" />

              </div>


            </div>
            <Image src={ Steps } alt="hero" width={ 50 } height={ 300 } />
            <div className="flex flex-col gap-10">

              <div className="flex flex-col items-center gap-16 justify-center">
                <div className="flex items-start flex-col gap-1.5">
                  <div className="flex flex-col gap-1">
                    <span className="bg-primary-100 text-white flex justify-center w-7 h-7 text-sm items-center rounded-full">1</span>
                    <h3 className="md:text-lg font-black font-sans text-black/70">Register & Verify</h3>
                  </div>
                  <p className="text-sm md:text-base text-black/50 "> Sign up and submit the required approvals to ensure compliance with regulations. We prioritize trust and safety, so your customers can buy with confidence.</p>
                </div>
                <Image className="w-32 lg:w-40" src={ Sell } width={ 40 } height={ 40 } alt="world icon" />


              </div>
              <div className="flex items-start flex-col gap-1.5">
                <div className="flex flex-col gap-1">
                  <span className="bg-primary-100 text-white flex justify-center w-7 h-7 text-sm items-center rounded-full">3</span>
                  <h3 className="md:text-lg font-black font-sans text-black/70">Start Selling</h3>
                </div>
                <p className="text-sm md:text-base text-black/50 "> Once approved, your store goes live! Connect with a wide customer base, receive orders, and provide essential medicines to those in need. Our platform helps you streamline transactions and ensures a smooth selling experience.</p>
              </div>
            </div>
          </div>
          {/* Mobile Layout */ }
          <div className="md:hidden flex flex-col gap-7 pt-5 ">
            <div className="flex items-start flex-col gap-1.5">
              <div className="flex flex-col gap-1">
                <span className="bg-primary-100 text-white flex justify-center w-5 h-5 text-xs md:w-7 md:h-7 md:text-sm items-center rounded-full">1</span>
                <h3 className="md:text-lg font-black font-sans text-black/70">Register & Verify</h3>
              </div>
              <p className="text-sm md:text-base  text-black/50 "> Sign up and submit the required approvals to ensure compliance with regulations. We prioritize trust and safety, so your customers can buy with confidence.</p>
            </div>
            <div className="flex items-start flex-col gap-1.5">
              <div className="flex flex-col gap-1">
                <span className="bg-primary-100 text-white flex justify-center w-5 h-5 text-xs md:w-7 md:h-7 md:text-sm items-center rounded-full">2</span>
                <h3 className="md:text-lg font-black font-sans text-black/70">List Your Products</h3>
              </div>
              <p className="text-sm md:text-base  text-black/50 "> Easily upload your medicines and healthcare products with detailed descriptions, pricing, and availability. Our intuitive dashboard helps you manage your inventory effortlessly.</p>
            </div>
            <div className="flex items-start flex-col gap-1.5">
              <div className="flex flex-col gap-1">
                <span className="bg-primary-100 text-white flex justify-center w-5 h-5 text-xs md:w-7 md:h-7 md:text-sm items-center rounded-full">3</span>
                <h3 className="md:text-lg font-black font-sans text-black/70">Start Selling </h3>
              </div>
              <p className="text-sm md:text-base  text-black/50 "> Once approved, your store goes live! Connect with a wide customer base, receive orders, and provide essential medicines to those in need. Our platform helps you streamline transactions and ensures a smooth selling experience.</p>
            </div>
          </div>
        </div>

      </div>
      <div className="w-11/12 mx-auto flex flex-col md:flex-row items-center md:items-start gap-10 py-10 md:py-16">
        <div className="md:w-1/2 flex flex-col gap-2 md:gap-3">
          <h2 className="text-lg md:text-2xl font-black text-black/80">How Customers Discover Your Pharmacy</h2>
          <div className="flex flex-col gap-3 md:gap-5">
            <p className="text-sm md:text-base text-black/60">Customers will access your pharmacy’s listings through our dedicated mobile app, designed for seamless browsing and discovery. They can search for medicines, view product details, and check availability at registered pharmacies. Once they find what they need, they can visit your physical store for pickup or inquire directly through the app for more information.</p>
            <p className="text-sm md:text-base text-black/60">By listing your products on our platform, you make it easier for potential buyers to find your pharmacy, increasing your visibility and sales. Our app ensures that users can quickly locate verified sellers like you, helping you connect with more customers and grow your business.</p>
          </div>
        </div>

        <div className="flex gap-3 w-4/5 md:w-1/2">
          <Image className="w-1/3 object-cover rounded-xl" src={ PictureOne } alt="pills" />
          <Image className="w-1/3 object-cover rounded-xl" src={ PictureTwo } alt="pills" />
          <Image className="w-1/3 object-cover rounded-xl" src={ PictureThree } alt="pills" />
        </div>
      </div>

      <div className="bg-primary-100 font-sans py-10">
        <div className="w-11/12 mx-auto  flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-black">Join Us Today</h1>
            <p className="text-white text-sm md:text-base">Help make medicine more accessible while growing your business. Register now to start selling!</p>
          </div>
          <Link href="/signup" className='cursor-pointer text-primary-100 font-sans text-lg bg-white px-10 py-1.5 md:py-2 rounded-full'>Register</Link>
        </div>
      </div>
      <div className="w-11/12 mx-auto flex flex-col md:flex-row items-center md:items-start gap-10 py-10 md:py-16">
        <div className="md:w-1/2 flex flex-col gap-2 md:gap-3">
          <h2 className="text-lg md:text-2xl font-black text-black/80">How Our Platform Helps</h2>
          <div className="flex flex-col gap-3 md:gap-5">
            <p className="text-sm md:text-base text-black/60">In Ethiopia, many people struggle to find essential medicines, especially for chronic illnesses like cancer, diabetes, and heart disease. Long pharmacy searches, lack of availability, and misinformation make it even harder for patients to get the treatment they need.</p>
            <p className="text-sm md:text-base text-black/60">Our platform aims to change that. We make it easier for people to find pharmacies that have the medicines they need—whether for online purchase or in-person pickup at registered pharmacy locations.</p>
          </div>
        </div>

        <div className="flex gap-3 w-4/5 md:w-1/2">
          <Image className="w-1/3 object-cover rounded-xl" src={ PictureFour } alt="pills" />
          <Image className="w-1/3 object-cover rounded-xl" src={ PictureFive } alt="pills" />
          <Image className="w-1/3 object-cover rounded-xl" src={ PictureSix } alt="pills" />
        </div>
      </div>


    </div >
  );
}
