import React from 'react';

const SearchInput = ({ placeholder, value, onChange }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="p-2 border-2 border-gray-300 rounded-lg bg-white/80 focus:border-blue-600 "
  />
);

export default SearchInput;
