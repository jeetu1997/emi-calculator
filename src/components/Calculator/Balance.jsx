import React, { useState, useEffect } from "react";
import { loanState as _loanState } from "../../constants/loanState";
import InputComponent from "./InputComponent";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
// const plugin = {
//   id: "increase-legend-spacing",
//   beforeInit(chart) {
//     // Get reference to the original fit function
//     const originalFit = chart.legend.fit;

//     // Override the fit function
//     chart.legend.fit = function fit() {
//       // Call original function and bind scope in order to use `this` correctly inside it
//       originalFit.bind(chart.legend)();
//       // Change the height as suggested in another answers
//       this.height += 20;
//     };
//   },
// };
Chart.register(
  ArcElement,
  Tooltip,
  Legend
  //plugin
);

export default function BalanceTransfer() {
  const { loan, interest, tenureB, loanB, interestB } = _loanState;
  const [loanAmount, setLoanAmount] = useState(loan.initial);
  const [interestRate, setInterestRate] = useState(interest.initial);
  const [loanTenureMonths, setLoanTenureMonths] = useState(tenureB.initial);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [monthlyEMISaved, setMonthlyEMISaved] = useState(0);
  const [monthlyNewEMI, setMonthlyNewEMI] = useState(0);
  const [emiPaidMonths, setEmiPaidMonths] = useState(5);
  const [newLoanAmount, setNewLoanAmount] = useState(loanB.initial);
  const [newInterestRate, setNewInterestRate] = useState(interestB.initial);
  const [totalSaving, setTotalSaving] = useState(0);

  const [chartData, setChartData] = useState({
    labels: ["Interest Amount", "Principal Amount"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#0f63ac", "#e9e9e9"],
        hoverBackgroundColor: ["#0f63ac", "#e9e9e9"],
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

  const handleLoanTenureMonthsChange = (event) => {
    const value = event.target.value;
    const tenureMonths = parseInt(event.target.value);
    if (value === "") {
      setLoanTenureMonths("");
    } else if (
      /^\d+$/.test(value) &&
      //tenureMonths >= tenure.min &&
      tenureMonths < 100
    ) {
      setLoanTenureMonths(tenureMonths);
    }
  };

  const handleEmiPaidMonthsChange = (event) => {
    const value = event.target.value;
    const tenureMonths = parseInt(event.target.value);
    if (value === "") {
      setEmiPaidMonths("");
    } else if (
      /^\d+$/.test(value) &&
      tenureMonths !== loanTenureMonths &&
      //tenureMonths >= tenure.min &&
      tenureMonths < 100
    ) {
      setEmiPaidMonths(tenureMonths);
    }
  };

  const handleLoanBAmountChange = (event) => {
    const amount = parseInt(event.target.value);
    if (event.target.value === "") {
      setNewLoanAmount("");
    } else if (/^\d+$/.test(amount) && amount <= loan.max) {
      setNewLoanAmount(amount);
    }
  };

  const handleInterestBRateChange = (event) => {
    const value = event.target.value;
    const rate = parseFloat(event.target.value);
    if (value === "") {
      setNewInterestRate("");
    } else if (/^\d\.$/.test(value)) {
      setNewInterestRate(value);
    } else if (
      /^\d+(\.\d{1,2})?$/.test(rate) &&
      //rate >= interest.min &&
      rate <= interest.max
    ) {
      setNewInterestRate(rate);
    }
  };

  useEffect(() => {
    const calculateEMI = () => {
      if (!monthlyNewEMI) return;
      // ... (your existing calculations)
      let nterm = loanTenureMonths - emiPaidMonths;
      console.log(monthlyEMI);
      const balanceNewEmi =
        (monthlyNewEMI / ((monthlyEMI - monthlyNewEMI) * nterm)) * 100;
      const monthlyEmiSaved = 100 - balanceNewEmi;
      // Update the chart data
      setChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: [balanceNewEmi, monthlyEmiSaved],
          },
        ],
      }));
    };

    calculateEMI();
  }, [emiPaidMonths, loanTenureMonths, monthlyEMI, monthlyNewEMI]);

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

      let nInterest = newInterestRate / 1200;
      let nterm = loanTenureMonths - emiPaidMonths;
      let ntop = Math.pow(1 + nInterest, nterm);
      let nbottom = ntop - 1;
      let nratio = ntop / nbottom;
      let newemi = newLoanAmount * nInterest * nratio;
      setMonthlyNewEMI(newemi.toFixed(2));
      setMonthlyEMISaved((emi - newemi).toFixed(2));
      setTotalSaving((emi.toFixed(0) - newemi.toFixed(0)) * nterm);
    };

    calculateEMI();
  }, [
    loanAmount,
    interestRate,
    loanTenureMonths,
    emiPaidMonths,
    newInterestRate,
    newLoanAmount,
  ]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
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
    radius: "70%",
    cutout: "80%", // Adjust the size of the doughnut hole
    elements: {
      arc: {
        borderWidth: 0, // Customize the border width
      },
    },
  };

  return (
    <div className="it-flex it-flex-wrap">
      <div className="it-w-full lg:it-w-5/12 sm:it-px-5 lg:it-mb-0 it-mb-8">
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
          step="1"
          min={interest.min}
          max={interest.max}
          range={interest.range}
          symbol={"%"}
        />
        <div className="it-flex it-flex-wrap it-mb-5">
          <div className="it-w-full lg:it-w-1/2 it-flex it-flex-wrap lg:it-flex-col it-mb-5">
            <div className="it-w-1/2">
              <label htmlFor="Loan Tenure" className="it-font-bold it-text-lg">
                Loan Tenure
              </label>
            </div>
            <div className="it-w-1/2 it-flex lg:it-flex-row it-flex-row-reverse it-items-center">
              <input
                type="text"
                id="Loan Tenure"
                value={loanTenureMonths}
                onChange={handleLoanTenureMonthsChange}
                className="!it-border !it-border-[#0f63ac] !it-p-2 !it-rounded-lg !it-w-[100px] !it-text-right focus:!it-border-[#000]"
              />
              <label className="it-font-bold it-text-lg it-mx-3">Months</label>
            </div>
          </div>
          <div className="it-w-full lg:it-w-1/2 it-flex it-flex-wrap lg:it-flex-col it-mb-5 lg:it-border-l it-border-custom-color lg:it-pl-8">
            <div className="lg:it-w-full it-w-1/2">
              <label
                htmlFor="EMI Already Paid"
                className="it-font-bold it-text-lg"
              >
                EMI Already Paid
              </label>
            </div>
            <div className="it-w-1/2 it-flex lg:it-flex-row it-flex-row-reverse it-items-center">
              <input
                type="text"
                id="EMI Already Paid"
                value={emiPaidMonths}
                onChange={handleEmiPaidMonthsChange}
                className="!it-border !it-border-[#0f63ac] !it-p-2 !it-rounded-lg !it-w-[100px] !it-text-right focus:!it-border-[#000]"
              />
              <label className="it-font-bold it-text-lg it-mx-3">Months</label>
            </div>
          </div>
        </div>

        <InputComponent
          className={"it-mb-10"}
          label={"New Loan Amount"}
          value={newLoanAmount}
          onChange={handleLoanBAmountChange}
          step="1000"
          min={loanB.min}
          max={loanB.max}
          range={loanB.range}
          symbol={"₹"}
        />

        <InputComponent
          className={"it-mb-10"}
          label={"New Interest Rate"}
          value={newInterestRate}
          onChange={handleInterestBRateChange}
          step="0.1"
          min={interestB.min}
          max={interestB.max}
          range={interestB.range}
          symbol={"%"}
        />
      </div>
      <div className="it-w-full lg:it-w-7/12 sm:it-px-5">
        <div
          className="it-h-full it-py-10 it-px-5 it-rounded-xl it-flex it-items-center it-justify-center"
          style={{ boxShadow: "0 0 8px 1px #e3e3e3" }}
        >
          <div className="it-flex it-flex-wrap it-items-center it-justify-center it-w-full">
            <div className="it-w-full lg:it-w-1/2 sm:it-px-4">
              <div className=" it-mb-6 lg:it-border-r-2 it-border-[#e3e3e3]">
                <div className="it-max-w-[300px] it-relative it-mx-auto">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="it-text-center it-absolute it-top-[55%] it-left-[50%] it-translate-x-[-50%] it-translate-y-[-50%]">
                    <label className="it-text-sm it-block it-font-bold">
                      New EMI
                    </label>
                    <label className="it-text-3xl it-font-bold">
                      {isNaN(monthlyNewEMI) ? "" : Math.ceil(monthlyNewEMI)}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="it-w-full lg:it-w-1/2 sm:it-px-4">
              <div
                id="result"
                className="[&>p]:it-mb-4 [&>p>label]:it-font-bold"
              >
                <p className="it-bg-[#0f63ac1a] it-rounded-lg it-flex it-justify-between it-py-2 it-px-4 it-text-lg">
                  <label>New EMI</label>
                  <label>
                    {isNaN(monthlyNewEMI) ? "" : Math.ceil(monthlyNewEMI)}
                  </label>
                </p>
                <p className="it-flex it-justify-between it-px-2 it-text-lg">
                  <label>Current EMI</label>{" "}
                  <label>
                    {isNaN(monthlyEMI) ? "" : Math.ceil(monthlyEMI)}
                  </label>
                </p>
                <p className="it-flex it-justify-between it-px-2 it-text-lg">
                  <label>Monthly EMI Saved </label>
                  <label>
                    {isNaN(monthlyEMISaved) ? "" : Math.ceil(monthlyEMISaved)}
                  </label>
                </p>
                <div className="it-h-[1px] it-bg-[#e3e3e3] it-my-4"></div>
                <p className="it-flex it-justify-between it-px-2 it-items-center it-text-lg it-rounded-lg">
                  <label>Total Savings</label>
                  <label>
                    {isNaN(totalSaving) ? "" : Math.ceil(totalSaving)}
                  </label>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
