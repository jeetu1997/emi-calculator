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
            data: [totalInterest, parseFloat(loanAmount) - totalInterest],
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
            return `${label}: $${value}`;
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
        <div className="it-w-full lg:it-w-5/12 it-px-5">
          <InputComponent
            className={"it-mb-8"}
            label={"Loan Amount"}
            value={loanAmount}
            onChange={handleLoanAmountChange}
            step="1000"
            min={loan.min}
            max={loan.max}
            range={loan.range}
          />

          <InputComponent
            className={"it-mb-8"}
            label={"Interest Rate (%)"}
            value={interestRate}
            onChange={handleInterestRateChange}
            step="0.1"
            min={interest.min}
            max={interest.max}
            range={interest.range}
          />

          <InputComponent
            label={"Loan Tenure (Years)"}
            value={loanTenureYears}
            onChange={handleLoanTenureYearsChange}
            step="0"
            min={tenure.min}
            max={tenure.max}
            range={tenure.range}
          />
        </div>
        <div className="it-w-full lg:it-w-7/12 it-px-5">
          <div className="it-h-full it-py-10 it-px-5 it-shadow-lg">
            <div className="it-flex it-flex-wrap it-min-h-[300px]">
              <div className="lg:it-w-1/2 it-px-4">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
              <div className="lg:it-w-1/2 it-px-4">
                <div id="result">
                  <p className=" it-flex it-justify-between it-p-2 it-text-lg">
                    <label>Monthly EMI</label>{" "}
                    <label className="it-font-bold">
                      {isNaN(monthlyEMI) ? "" : Math.ceil(monthlyEMI)}
                    </label>
                  </p>
                  <p className="it-flex it-justify-between it-p-2 it-text-lg">
                    <label>Total Interest Payable </label>
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
