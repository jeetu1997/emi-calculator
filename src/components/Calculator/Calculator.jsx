import React, { useState, useEffect } from "react";
import { loanState as _loanState } from "../../constants/loanState";
import InputComponent from "./InputComponent";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
const plugin = {
  id: "increase-legend-spacing",
  beforeInit(chart) {
    // Get reference to the original fit function
    const originalFit = chart.legend.fit;

    // Override the fit function
    chart.legend.fit = function fit() {
      // Call original function and bind scope in order to use `this` correctly inside it
      originalFit.bind(chart.legend)();
      // Change the height as suggested in another answers
      this.height += 20;
    };
  },
};
Chart.register(ArcElement, Tooltip, Legend, plugin);

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
        <div
          className="it-h-full it-py-10 it-px-5 it-rounded-xl it-flex it-items-center it-justify-center"
          style={{ boxShadow: "0 0 8px 1px #e3e3e3" }}
        >
          <div className="it-flex it-flex-wrap it-items-center it-justify-center it-w-full">
            <div className="it-w-full lg:it-w-1/2 sm:it-px-4">
              <div className=" it-mb-6 lg:it-border-r-2 it-border-[#e3e3e3]">
                <div className="it-max-w-[230px] it-relative it-mx-auto">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="it-text-center it-absolute it-top-[65%] it-left-[50%] it-translate-x-[-50%] it-translate-y-[-50%]">
                    <label className="it-text-sm it-block it-font-bold">
                      New EMI
                    </label>
                    <label className="it-text-3xl it-font-bold">
                      {isNaN(monthlyEMI) ? "" : Math.ceil(monthlyEMI)}
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
                  <label>Loan EMI</label>
                  <label>
                    {isNaN(monthlyEMI) ? "" : Math.ceil(monthlyEMI)}
                  </label>
                </p>
                <p className="it-flex it-justify-between it-px-2 it-text-lg">
                  <label>Principal Amount</label> <label>{loanAmount}</label>
                </p>
                <p className="it-flex it-justify-between it-px-2 it-text-lg">
                  <label>Total Interest </label>
                  <label>
                    {isNaN(totalInterest) ? "" : Math.ceil(totalInterest)}
                  </label>
                </p>
                <div className="it-h-[1px] it-bg-[#e3e3e3] it-my-4"></div>
                <p className="it-flex it-justify-between it-px-2 it-items-center it-text-lg it-rounded-lg">
                  <label>Total Payment</label>
                  <label>
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
  );
}
