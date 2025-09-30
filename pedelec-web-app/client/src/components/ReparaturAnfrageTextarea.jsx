import React from 'react';

const ReparaturAnfrageTextarea = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block font-bold mb-2 text-gray-800">
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required
      className="w-full p-3 border border-gray-300 rounded-xl bg-white/70 shadow-inner focus:border-blue-400 focus:outline-none transition duration-300"
      style={{ height: '200px' }}
    ></textarea>
  </div>
);

export default ReparaturAnfrageTextarea;
