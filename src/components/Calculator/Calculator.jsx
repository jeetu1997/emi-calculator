import React, { useState, useEffect } from "react";
import "./style.css";
import { loanState as _loanState } from "../../constants/loanState";

export default function Calculator({ loanState }) {
  const { name, loan, interest, tenure } = loanState || _loanState;
  const [loanAmount, setLoanAmount] = useState(loan.initial);
  const [interestRate, setInterestRate] = useState(interest.initial);
  const [loanTenureYears, setLoanTenureYears] = useState(tenure.initial);
  const [loanTenureMonths, setLoanTenureMonths] = useState(tenure.initial * 12);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    const { loan, interest, tenure } = loanState || _loanState;
    setLoanAmount(loan.initial);
    setInterestRate(interest.initial);
    setLoanTenureYears(tenure.initial);
    setLoanTenureMonths(tenure.initial * 12);
  }, [loanState]);

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

  return (
    <div className="container">
      <h1>Calculate your EMI for {name}</h1>
      <div>
        <label htmlFor="loan-amount">Loan Amount</label>
        <input
          type="text"
          id="loan-amount"
          min={loan.min}
          max={loan.max}
          value={loanAmount}
          onChange={handleLoanAmountChange}
        />
        <input
          type="range"
          step="1000"
          min={loan.min}
          max={loan.max}
          value={loanAmount}
          onChange={handleLoanAmountChange}
        />
      </div>
      <div>
        <label htmlFor="interest-rate">Interest Rate (%)</label>
        <input
          type="text"
          id="interest-rate"
          value={interestRate}
          onChange={handleInterestRateChange}
        />
        <input
          type="range"
          min={interest.min}
          max={interest.max}
          step="0.1"
          value={interestRate}
          onChange={handleInterestRateChange}
        />
      </div>
      <div>
        <label htmlFor="loan-tenure">Loan Tenure (Years)</label>
        <input
          type="text"
          id="loan-tenure"
          min={tenure.min}
          max={tenure.max}
          value={loanTenureYears}
          onChange={handleLoanTenureYearsChange}
        />
        <input
          type="range"
          min={tenure.min}
          max={tenure.max}
          value={loanTenureYears}
          onChange={handleLoanTenureYearsChange}
        />
      </div>
      <div id="result">
        <p>Monthly EMI: {isNaN(monthlyEMI) ? "" : Math.ceil(monthlyEMI)}</p>
        <p>
          Total Interest Payable:{" "}
          {isNaN(totalInterest) ? "" : Math.ceil(totalInterest)}
        </p>
        <p>
          Total Payment:{" "}
          {isNaN(monthlyEMI * loanTenureMonths)
            ? ""
            : Math.ceil(monthlyEMI * loanTenureMonths)}
        </p>
      </div>
    </div>
  );
}
