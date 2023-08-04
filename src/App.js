import Calculator from "./components/Calculator/Calculator";

export default function App() {
  return (
    <div className="it-mt-16">
      <div className="it-container it-mx-auto it-px-4">
        <h1 className="it-text-5xl it-text-center it-mb-6 it-font-bold">
          EMI Calculator
        </h1>
        <p className="it-text-center">
          Calculate your EMI for different interest rates, loan amounts and loan
          tenures, using EMI Calculator.
        </p>
        <Calculator />
      </div>
    </div>
  );
}
