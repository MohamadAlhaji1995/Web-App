import React, { useState } from 'react';
import axios from 'axios';
import ReparaturAnfrageInput from './ReparaturAnfrageInput';
import ReparaturAnfrageTextarea from './ReparaturAnfrageTextarea';
import ReparaturAnfrageButton from './ReparaturAnfrageButton';

const ReparaturAnfrageForm = () => {
  const [formData, setFormData] = useState({
    bikeName: '',
    beschreibung: '',
    kontaktEmail: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/reparatur-anfrage', formData);
      alert('Die Anfrage wurde erfolgreich gesendet!');
    } catch (error) {
      console.error(
        'Fehler beim Senden der Reparaturanfrage:',
        error.response?.data || error.message
      );
      alert(
        'Fehler beim Senden der Anfrage: ' +
          (error.response?.data.error || error.message)
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto my-5 p-6 bg-white/20 rounded-2xl shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue-500 transition duration-300 backdrop-blur-lg"
    >
      <h2 className="text-center mb-5 text-2xl font-bold text-gray-800">
        Reparaturanfrage
      </h2>
      <ReparaturAnfrageInput
        label="Bike Name:"
        name="bikeName"
        type="text"
        value={formData.bikeName}
        onChange={handleChange}
      />
      <ReparaturAnfrageTextarea
        label="Beschreibung des Problems:"
        name="beschreibung"
        value={formData.beschreibung}
        onChange={handleChange}
      />
      <ReparaturAnfrageInput
        label="Kontakt E-Mail:"
        name="kontaktEmail"
        type="email"
        value={formData.kontaktEmail}
        onChange={handleChange}
      />
      <ReparaturAnfrageButton label="Anfrage senden" />
    </form>
  );
};

export default ReparaturAnfrageForm;
