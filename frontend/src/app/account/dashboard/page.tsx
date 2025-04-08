"use client";
import { MdNumbers } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa6";
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
} from 'chart.js';
;
import OrdersTable from "./OrdersTable";

Chart.register(ArcElement, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend);

type Sale = {
  year: number;
  month: string;
  below500: number;
  between500and1000: number;
  above1000: number;
  totalSales: number;
  totalOrders: number;
};

const Page = () => {




  const totalStats = {
    Analgesics: 45,
    Antibiotics: 78,
    AllergyMedications: 23,
    AntidiabeticDrugs: 56,
    Antivirals: 12,
    categories: {
      pres: 56,
      nonPres: 23,

    }

  };

  const { Analgesics,
    Antibiotics,
    AllergyMedications,
    AntidiabeticDrugs,
    Antivirals, categories } = totalStats
  const { pres, nonPres } = categories
  const totalPrice = 59000
  const totalCount = 390
  const totalPriceRange = Analgesics + Antibiotics + AllergyMedications + AntidiabeticDrugs + Antivirals
  const totalCategory = pres + nonPres
  const priceData = {
    labels: [
      'Analgesics',
      'Antibiotics',
      'Allergy Medications',
      'Antidiabetic Drugs',
      "Antivirals"
    ],
    datasets: [{
      label: 'Total Revenu By Category',
      data: [Analgesics,
        Antibiotics,
        AllergyMedications,
        AntidiabeticDrugs,
        Antivirals],
      backgroundColor: [
        'rgb(255,189,18)',
        'rgb(24,216,126)',
        'rgb(254,26,126)',
        'rgb(54,16,324)',
        'rgb(20,242,223)',
      ],
      hoverOffset: 4,
    }]
  };
  const categoryData = {
    labels: [
      'Prescription',
      'Non Prescription',


    ],
    datasets: [{
      label: 'Total Revenu By Prescription',
      data: [pres, nonPres],
      backgroundColor: [
        'rgb(66,80,249)',
        'rgb(130,166,254)',

      ],
      hoverOffset: 4,
    }]
  };


  const options = {
    responsive: false,
    maintainAspectRatio: false,
    layout: {
      padding: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '60%',
  };






  const labels = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dataValues = [5000, 7000, 8000, 6500, 9000, 7500, 8500, 9500, 7200, 8800, 9400, 11000];

  const currentDate = new Date().getMonth(); // Example condition to change colors

  const barData = {
    labels,
    datasets: [
      {
        label: "Revenue per Month",
        data: dataValues,
        backgroundColor: currentDate ? "rgb(217,155,235)" : "rgb(247,155,0)",
        borderColor: currentDate ? "rgba(217,155,235,0.9)" : "rgba(247,155,0,0.9)",
        borderWidth: 1,
      },
    ],
  };


  return (
    <div className="max-w-[1440px] lg:w-11/12 mx-auto flex flex-col gap-10">
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-min gap-x-5 gap-y-10 md:gap-5 items-start">
        <div className="bg-white  shadow-md h-full p-5 flex flex-col gap-5 rounded-lg">
          <div className="flex  w-full items-center justify-between">
            <h4 className="font-semibold  text-primaryColor-200">Total Revenu</h4>
            <FaDollarSign className="w-5 h-5 text-primaryColor-300" />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-2xl md:text-4xl font-bold">{ totalPrice }</p>
          </div>
        </div>
        <div className="bg-white  shadow-md h-full p-5 flex flex-col gap-5 rounded-lg">
          <div className="flex  w-full items-center justify-between">
            <h4 className="font-semibold  text-primaryColor-200">Total Order</h4>
            <MdNumbers className="w-5 h-5 text-primaryColor-300" />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-2xl md:text-4xl font-bold">{ totalCount }</p>
          </div>
        </div>


        <div className="bg-white shadow-md w-full h-full md:row-start-1 md:row-end-3 md:col-start-3 md:col-end-5  p-5 flex flex-col gap-5 rounded-lg">
          <h4 className="font-semibold text-primaryColor-200">Total Revenu By Common Medicine</h4>
          <div className="flex flex-col-reverse md:flex-row w-full items-start gap-5 md:items-end justify-between">
            <ul className="space-y-2">
              { priceData.labels.map((label, index) => (
                <li key={ index } className="flex items-center space-x-2">
                  <span
                    className="w-7 h-4 block rounded-sm"
                    style={ { backgroundColor: priceData.datasets[0].backgroundColor[index] } }
                  ></span>
                  <span className="text-gray-700 text-sm flex gap-1"><span className="font-semibold">
                    { totalPriceRange > 0 &&
                      `
                   ${((priceData.datasets[0].data[index] / totalPriceRange) * 100).toFixed(0)}%
                    `
                    }
                  </span>{ label }</span>
                </li>
              )) }
            </ul>
            <div className="mx-auto">
              <Doughnut data={ priceData } options={ options } width={ 170 } height={ 170 } />
            </div>
          </div>
        </div>

        <div className="md:row-start-2 md:row-end-5  md:col-start-1 h-full md:col-end-3 shadow-md w-full  p-5 flex flex-col gap-5 rounded-lg">

          <Bar data={ barData } height={ 200 } />
        </div>

        <div className="bg-white  shadow-md w-full h-full md:row-start-3 md:row-end-5 md:col-start-3 md:col-end-5  p-5 flex flex-col gap-5 rounded-lg">
          <h4 className="font-semibold text-primaryColor-200">Total Revenu By Category</h4>
          <div className="flex flex-col-reverse md:flex-row w-full items-start gap-5 md:items-end justify-between">
            <ul className="space-y-2">
              { categoryData.labels.map((label, index) => (
                <li key={ index } className="flex items-center space-x-2">
                  <span
                    className="w-7 h-4 block rounded-sm"
                    style={ { backgroundColor: categoryData.datasets[0].backgroundColor[index] } }
                  ></span>
                  <span className="text-gray-700 text-sm flex gap-1"><span className="font-semibold">
                    { totalPriceRange > 0 &&
                      `
                   ${((categoryData.datasets[0].data[index] / totalCategory) * 100).toFixed(0)}%
                    `
                    }
                  </span>{ label }</span>
                </li>
              )) }
            </ul>
            <div className="mx-auto">
              <Doughnut data={ categoryData } options={ options } width={ 170 } height={ 170 } />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white flex flex-col gap-3 px-5 py-4 rounded-md shadow-md font-sans">
        <h3 className="font-bold text-2xl text-black/80">Recent Orders</h3>
        <OrdersTable />
      </div>
    </div>
  );
};

export default Page;