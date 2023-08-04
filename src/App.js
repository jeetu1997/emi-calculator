import { useState } from "react";
import Calculator from "./components/Calculator/Calculator";
import { options } from "./constants/options";

export default function App() {
  const [dd, setDd] = useState(options[0]);
  const [val, setVal] = useState(0);
  const handleChange = (e) => {
    setDd(options[Number(e.target.value)]);
    setVal(0);
  };
  const handleFor = (e) => {
    setVal(e.target.value);
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
          <select onChange={handleFor} value={val}>
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
      <Calculator loanState={dd.items[val].state} />
    </div>
  );
}
