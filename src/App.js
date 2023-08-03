import { useState } from "react";
import Calculator from "./components/Calculator/Calculator";
import { options } from "./constants/options";

export default function App() {
  const [dd, setDd] = useState(options[0]);
  const [loanState, setLoanState] = useState(dd.items[0].state);
  const handleChange = (e) => {
    setDd(options[Number(e.target.value)]);
  };
  const handleFor = (e) => {
    setLoanState(dd.items[e.target.value].state);
  };
  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ marginRight: "40px" }}>
          <label>I am interested in:</label>
          <select onChange={handleChange}>
            {options.map((option, index) => {
              return (
                <option key={option.id} value={index}>
                  {option.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>for</label>
          <select onChange={handleFor}>
            {dd.items.map((res, index) => {
              return (
                <option key={res.id} value={index}>
                  {res.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <Calculator loanState={loanState} />
    </div>
  );
}
