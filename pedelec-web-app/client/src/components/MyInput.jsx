import React from "react";

const MyInput = ({ htmlFor, placeholder, type, id, value, setValue }) => {
  return (
    <div className="mb-2">
      <label htmlFor={htmlFor} className="block text-blue-800 mb-2">
        {placeholder}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className="w-full p-3 rounded-2xl border border-gray-300 "
      />
    </div>
  );
};

export default MyInput;
