import React from "react";

const PriceInput = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
          onChange(e);
        }
      }}
      className="p-2 border-2 border-gray-300 rounded-lg bg-white/80 focus:border-blue-600 focus:ring focus:ring-blue-200 transition duration-300"
    />
  );
};

export default PriceInput;
