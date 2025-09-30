import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnfrageTable from '../components/AnfrageTable';
import Pagination from '../components/Pagination'; 

const RepZeigenPage = () => {
  const [anfragen, setAnfragen] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAnfragen(currentPage);
  }, [currentPage]);

  const fetchAnfragen = (page) => {
    axios
      .get(`http://localhost:3001/api/reparatur-anfrage?page=${page}`)
      .then((response) => {
        setAnfragen(response.data.anfragen);
        setTotalPages(response.data.pages);
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen der Reparaturanfragen:', error);
      });
  };

  const handleStatusChange = (id, newStatus) => {
    axios
      .put(`http://localhost:3001/api/reparatur-anfrage/${id}`, { status: newStatus })
      .then(() => {
        setAnfragen((prev) =>
          prev.map((anfrage) => (anfrage._id === id ? { ...anfrage, status: newStatus } : anfrage))
        );
      })
      .catch((error) => {
        console.error('Fehler beim Aktualisieren des Status:', error);
      });
  };

  const handleDeleteAnfrage = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/reparatur-anfrage/${id}`);
      setAnfragen((prev) => prev.filter((anfrage) => anfrage._id !== id));
      alert('Reparaturanfrage erfolgreich gelöscht');
    } catch (error) {
      console.error('Fehler beim Löschen der Reparaturanfrage:', error);
      alert('Fehler beim Löschen der Anfrage: ' + (error.response?.data.error || error.message));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 backdrop-blur-lg">
      <h1 className="text-2xl font-bold text-center mb-4 text-blue-800">Reparaturanfragen</h1>
      <div className="p-6 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg">
        <AnfrageTable
          anfragen={anfragen}
          handleStatusChange={handleStatusChange}
          handleDeleteAnfrage={handleDeleteAnfrage}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default RepZeigenPage;
