import React from "react";

const ReparaturAnfrageButton = ({ label }) => (
  <button
    type="submit"
    className="w-full p-2 bg-transparent text-blue-500 border-2 border-blue-500 rounded-2xl font-bold text-lg hover:bg-blue-100 hover:border-blue-500 hover:text-blue-500 transition duration-300 transform"
  >
    {label}
  </button>
);

export default ReparaturAnfrageButton;
