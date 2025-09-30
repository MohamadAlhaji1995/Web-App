import React from 'react';
import StatusSelect from './StatusSelect';

const AnfrageRow = ({ anfrage, handleStatusChange, handleDeleteAnfrage }) => (
  <tr>
    <td className="p-4 border">{anfrage.bikeName}</td>
    <td className="p-4 border">{anfrage.description}</td>
    <td className="p-4 border">{anfrage.contactEmail}</td>
    <td className="p-4 border">
      <StatusSelect
        value={anfrage.status}
        onChange={(newStatus) => handleStatusChange(anfrage._id, newStatus)}
      />
    </td>
    <td className="p-4 border">{new Date(anfrage.createdAt).toLocaleDateString()}</td>
    <td className="p-4 border">
      <button
        onClick={() => handleDeleteAnfrage(anfrage._id)}
        className="p-2 border-2 rounded-xl text-red-600 border-red-600 hover:bg-red-100 font-bold"
      >
        Löschen
      </button>
    </td>
  </tr>
);

export default AnfrageRow;
