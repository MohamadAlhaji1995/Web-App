import React from 'react';

const SelectBrand = ({ value, onChange, brands }) => (
  <select
    value={value}
    onChange={onChange}
    className="p-2 border-2 border-gray-300 rounded-lg bg-white/80 focus:border-blue-600 focus:ring focus:ring-blue-200 transition duration-300"
  >
    <option value="">Marke auswählen</option>
    {brands.map((brand, index) => (
      <option key={index} value={brand}>
        {brand}
      </option>
    ))}
  </select>
);

export default SelectBrand;
