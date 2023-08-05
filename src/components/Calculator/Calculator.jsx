import React, { useState, useEffect } from "react";
import { loanState as _loanState } from "../../constants/loanState";
import InputComponent from "./InputComponent";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function Calculator() {
  const { loan, interest, tenure } = _loanState;
  const [loanAmount, setLoanAmount] = useState(loan.initial);
  const [interestRate, setInterestRate] = useState(interest.initial);
  const [loanTenureYears, setLoanTenureYears] = useState(tenure.initial);
  const [loanTenureMonths, setLoanTenureMonths] = useState(tenure.initial * 12);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const [chartData, setChartData] = useState({
    labels: ["Interest Amount", "Principal Amount"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#0f63ac", "#36A2EB"],
        hoverBackgroundColor: ["#0f63ac", "#36A2EB"],
      },
    ],
  });

  const handleLoanAmountChange = (event) => {
    const amount = parseInt(event.target.value);
    if (event.target.value === "") {
      setLoanAmount("");
    } else if (/^\d+$/.test(amount) && amount <= loan.max) {
      setLoanAmount(amount);
    }
  };

  const handleInterestRateChange = (event) => {
    const value = event.target.value;
    const rate = parseFloat(event.target.value);
    if (value === "") {
      setInterestRate("");
    } else if (/^\d\.$/.test(value)) {
      setInterestRate(value);
    } else if (
      /^\d+(\.\d{1,2})?$/.test(rate) &&
      //rate >= interest.min &&
      rate <= interest.max
    ) {
      setInterestRate(rate);
    }
  };

  const handleLoanTenureYearsChange = (event) => {
    const value = event.target.value;
    const tenureYears = parseInt(event.target.value);
    if (value === "") {
      setLoanTenureYears("");
      //setLoanTenureMonths();
    } else if (
      /^\d+$/.test(value) &&
      //tenureYears >= tenure.min &&
      tenureYears <= tenure.max
    ) {
      setLoanTenureYears(tenureYears);
      setLoanTenureMonths(tenureYears * 12);
    }
  };

  useEffect(() => {
    const calculateEMI = () => {
      // ... (your existing calculations)

      // Update the chart data
      setChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: [totalInterest, parseFloat(loanAmount)],
          },
        ],
      }));
    };

    calculateEMI();
  }, [loanAmount, totalInterest]);

  useEffect(() => {
    const calculateEMI = () => {
      const monthlyInterest = interestRate / 1200; // Monthly interest rate
      const totalMonths = loanTenureMonths;
      const emi =
        (loanAmount *
          monthlyInterest *
          Math.pow(1 + monthlyInterest, totalMonths)) /
        (Math.pow(1 + monthlyInterest, totalMonths) - 1);

      setMonthlyEMI(emi.toFixed(2));

      const totalPayment = emi * totalMonths;
      const totalInterestPayable = totalPayment - loanAmount;
      setTotalInterest(totalInterestPayable.toFixed(2));
    };

    calculateEMI();
  }, [loanAmount, interestRate, loanTenureMonths]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.formattedValue;
            const label = context.label;
            return `${label}: ${value}`;
          },
        },
      },
    },
    cutout: "85%", // Adjust the size of the doughnut hole
    elements: {
      arc: {
        borderWidth: 2, // Customize the border width
      },
    },
  };

  return (
    <div className="it-mt-20">
      <div className="it-flex it-flex-wrap">
        <div className="it-w-full lg:it-w-5/12 sm:it-px-5">
          <InputComponent
            className={"it-mb-10"}
            label={"Loan Amount"}
            value={loanAmount}
            onChange={handleLoanAmountChange}
            step="1000"
            min={loan.min}
            max={loan.max}
            range={loan.range}
            symbol={"₹"}
          />

          <InputComponent
            className={"it-mb-10"}
            label={"Interest Rate"}
            value={interestRate}
            onChange={handleInterestRateChange}
            step="0.1"
            min={interest.min}
            max={interest.max}
            range={interest.range}
            symbol={"%"}
          />

          <InputComponent
            label={"Loan Tenure"}
            value={loanTenureYears}
            onChange={handleLoanTenureYearsChange}
            step="0"
            min={tenure.min}
            max={tenure.max}
            range={tenure.range}
            symbol={"Yrs"}
          />
        </div>
        <div className="it-w-full lg:it-w-7/12 sm:it-px-5">
          <div className="it-h-full it-py-10 it-px-5 it-shadow-lg it-rounded-xl">
            <div className="it-flex it-flex-wrap it-items-center it-justify-center">
              <div className="it-w-full lg:it-w-1/2 sm:it-px-4 ">
                <div className="it-relative it-mb-6 it-min-h-[320px]">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="it-text-center it-absolute it-top-[50%] it-left-[50%] it-translate-x-[-50%] it-translate-y-[-50%]">
                    <label className="it-text-lg it-block it-font-bold">
                      New EMI
                    </label>
                    <label className="it-text-4xl it-font-bold">
                      {isNaN(monthlyEMI) ? "" : Math.ceil(monthlyEMI)}
                    </label>
                  </div>
                </div>
              </div>
              <div className="it-w-full lg:it-w-1/2 sm:it-px-4">
                <div id="result">
                  <p className=" it-flex it-justify-between it-p-2 it-text-lg">
                    <label>Principal Amount</label>{" "}
                    <label className="it-font-bold">{loanAmount}</label>
                  </p>
                  <p className="it-flex it-justify-between it-p-2 it-text-lg">
                    <label>Total Interest </label>
                    <label className="it-font-bold">
                      {isNaN(totalInterest) ? "" : Math.ceil(totalInterest)}
                    </label>
                  </p>
                  <div className="it-h-[1px] it-bg-black it-my-6"></div>
                  <p className="it-bg-blue-200 it-flex it-justify-between it-items-center it-py-2 it-px-4 it-text-lg it-rounded-lg ">
                    <label>Total Payment</label>
                    <label className="it-font-bold">
                      {isNaN(monthlyEMI * loanTenureMonths)
                        ? ""
                        : Math.ceil(monthlyEMI * loanTenureMonths)}
                    </label>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
