import React from "react";

export default function InputComponent({
  className,
  label,
  onChange,
  min,
  max,
  value,
  step,
  range = [],
}) {
  return (
    <div className={className}>
      <div className="it-flex it-justify-between it-mb-5">
        <label
          htmlFor="loan-amount"
          className="it-font-bold it-text-lg it-w-1/2"
        >
          {label}
        </label>
        <div className="it-w-1/2 it-flex it-justify-end it-items-center">
          <label className="it-font-bold it-text-lg it-mr-3">₹</label>
          <input
            type="text"
            id="loan-amount"
            value={value}
            onChange={onChange}
            className="it-border-2 it-border-gray-400 it-p-2 it-rounded-lg it-w-[100px] it-text-right"
          />
        </div>
      </div>
      <div>
        <input
          type="range"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="it-w-full"
        />
        <div className="it-flex it-justify-between [&>label]:it-text-base">
          {range.map((res) => {
            return <label key={res}>{res}</label>;
          })}
        </div>
      </div>
    </div>
  );
}
