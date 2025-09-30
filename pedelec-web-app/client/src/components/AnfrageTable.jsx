import React from 'react';
import AnfrageRow from './AnfrageRow';

const AnfrageTable = ({ anfragen, handleStatusChange, handleDeleteAnfrage }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-sm sm:text-md md:text-lg">
      <thead>
        <tr className="bg-blue-500 text-white">
          <th className="p-4 border">Bike Name</th>
          <th className="p-4 border">Beschreibung</th>
          <th className="p-4 border">Kontakt E-Mail</th>
          <th className="p-4 border">Status</th>
          <th className="p-4 border">Erstellt am</th>
          <th className="p-4 border">Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {anfragen.map((anfrage) => (
          <AnfrageRow
            key={anfrage._id}
            anfrage={anfrage}
            handleStatusChange={handleStatusChange}
            handleDeleteAnfrage={handleDeleteAnfrage}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default AnfrageTable;
