import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";

function App() {
  const [loanAmount, setLoanAmount] = useState("50000");
  const [interestRate, setInterestRate] = useState("5");
  const [loanTenureMonths, setLoanTenureMonths] = useState("60");
  const [emiPaidMonths, setEmiPaidMonths] = useState("12");
  const [newLoanAmount, setNewLoanAmount] = useState("40000");
  const [newInterestRate, setNewInterestRate] = useState("4");

  const [totalInterestSaved, setTotalInterestSaved] = useState("0.00");

  const [newEMI, setNewEMI] = useState("0.00");
  const [currentEMI, setCurrentEMI] = useState("0.00");
  const [monthlyEMISaved, setMonthlyEMISaved] = useState("0.00");
  const [totalSavings, setTotalSavings] = useState("0.00");
  const [chartData, setChartData] = useState({
    labels: ["Total Interest Paid", "Remaining Interest"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  });

  useEffect(() => {
    const calculateInterestSaved = () => {
      const originalInterest =
        (loanAmount * interestRate * loanTenureMonths) / 1200;
      const newInterest =
        (newLoanAmount * newInterestRate * loanTenureMonths) / 1200;
      const remainingInterest =
        newInterest - (emiPaidMonths * newLoanAmount * newInterestRate) / 1200;
      const interestSaved = originalInterest - remainingInterest;
      setTotalInterestSaved(interestSaved.toFixed(2));

      setChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: [interestSaved, remainingInterest],
          },
        ],
      }));
    };

    const originalEMI = (loanAmount * interestRate * loanTenureMonths) / 1200;
    setCurrentEMI(originalEMI.toFixed(2));

    const newEMIValue =
      (newLoanAmount * newInterestRate * loanTenureMonths) / 1200;
    setNewEMI(newEMIValue.toFixed(2));

    const monthlySavings = parseFloat(currentEMI) - parseFloat(newEMI);
    setMonthlyEMISaved(monthlySavings.toFixed(2));

    const totalSavingsValue =
      parseFloat(monthlySavings) * parseInt(emiPaidMonths);
    setTotalSavings(totalSavingsValue.toFixed(2));

    calculateInterestSaved();
  }, [
    loanAmount,
    interestRate,
    loanTenureMonths,
    emiPaidMonths,
    newLoanAmount,
    newInterestRate,
    currentEMI,
    newEMI,
  ]);

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
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className="container">
      <h1>Balance Transfer Calculator</h1>
      <div>
        <label htmlFor="loan-amount">Original Loan Amount</label>
        <input
          type="text"
          id="loan-amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="interest-rate">Original Interest Rate (%)</label>
        <input
          type="text"
          id="interest-rate"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="loan-tenure">Loan Tenure (Months)</label>
        <input
          type="text"
          id="loan-tenure"
          value={loanTenureMonths}
          onChange={(e) => setLoanTenureMonths(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="emi-paid">EMI Already Paid (Months)</label>
        <input
          type="text"
          id="emi-paid"
          value={emiPaidMonths}
          onChange={(e) => setEmiPaidMonths(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="new-loan-amount">New Loan Amount</label>
        <input
          type="text"
          id="new-loan-amount"
          value={newLoanAmount}
          onChange={(e) => setNewLoanAmount(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="new-interest-rate">New Interest Rate (%)</label>
        <input
          type="text"
          id="new-interest-rate"
          value={newInterestRate}
          onChange={(e) => setNewInterestRate(e.target.value)}
        />
      </div>
      <div id="result">
        <p>Total Interest Saved: ${totalInterestSaved}</p>

        <div className="chart-container">
          <Doughnut data={chartData} options={chartOptions} />
        </div>

        <p>Total Interest Saved: ${totalInterestSaved}</p>
        <p>Current EMI: ${currentEMI}</p>
        <p>New EMI: ${newEMI}</p>
        <p>Monthly EMI Saved: ${monthlyEMISaved}</p>
        <p>Total Savings: ${totalSavings}</p>
      </div>
    </div>
  );
}

export default App;
