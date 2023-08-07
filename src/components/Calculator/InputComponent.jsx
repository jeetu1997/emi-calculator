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
  symbol,
}) {
  return (
    <div className={className}>
      <div className="it-flex it-justify-between it-mb-5">
        <label htmlFor={label} className="it-font-bold it-text-lg it-w-1/2">
          {label}
        </label>
        <div className="it-w-1/2 it-flex it-justify-end it-items-center">
          <label className="it-font-bold it-text-lg it-mr-3">{symbol}</label>
          <input
            type="text"
            id={label}
            value={value}
            onChange={onChange}
            className="!it-border !it-border-[#0f63ac] !it-p-2 !it-rounded-lg !it-w-[100px] !it-text-right focus:!it-border-[#000]"
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
