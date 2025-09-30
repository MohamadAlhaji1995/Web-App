import React from "react";

const RentForm = ({
  rentStartDate,
  setRentStartDate,
  rentEndDate,
  setRentEndDate,
  handleRent,
  bike,
}) => {
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 bg-white/90 p-2 rounded-xl ">
      <label className="block">
        Start:
        <input
          type="date"
          value={rentStartDate}
          onChange={(e) => setRentStartDate(e.target.value)}
          className="border border-gray-400 rounded-md p-1 mt-2"
        />
      </label>
      <label className="block mt-4">
        Ende:
        <input
          type="date"
          value={rentEndDate}
          onChange={(e) => setRentEndDate(e.target.value)}
          className="border border-gray-400 rounded-md p-1 mt-2"
        />
      </label>
      <button
        className="px-2 py-1 border border-green-600 text-green-600 rounded-xl text-sm hover:bg-green-100"
        onClick={() => handleRent(bike)}
      >
        Mietvorgang bestätigen
      </button>
    </div>
  );
};

export default RentForm;
