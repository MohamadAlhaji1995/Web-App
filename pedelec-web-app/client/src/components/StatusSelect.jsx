import React from 'react';

const StatusSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-2 py-1 bg-white border border-gray-300 rounded-md"
  >
    <option value="in Bearbeitung">In Bearbeitung</option>
    <option value="fertig">Fertig</option>
  </select>
);

export default StatusSelect;
