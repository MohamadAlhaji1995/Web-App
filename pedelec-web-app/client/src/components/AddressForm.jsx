import React from 'react';

const AddressForm = ({ address, handleAddressChange, handleNextStep }) => {
    const submitAddressForm = (e) => {
      e.preventDefault();
  
      // Überprüfen, ob alle Felder ausgefüllt sind
      if (
        !address.Vorname ||
        !address.Nachname ||
        !address.Straße ||
        !address.Stadt ||
        !address.Postleitzahl
      ) {
        alert("Bitte füllen Sie alle Felder aus.");
        return;
      }
  
      // Überprüfen, ob Postleitzahl numerisch ist
      if (isNaN(address.Postleitzahl)) {
        alert("Postleitzahl muss eine Zahl sein.");
        return;
      }
  
      handleNextStep();
    };
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          Lieferadresse eingeben
        </h2>
        <form onSubmit={submitAddressForm} className="space-y-4">
          {["Vorname", "Nachname", "Straße", "Stadt", "Postleitzahl"].map(
            (field) => (
              <div key={field}>
                <label className="block font-semibold text-blue-800">
                  {field}:
                </label>
                <input
                  type="text"
                  name={field}
                  value={address[field] || ""}
                  onChange={(e) => handleAddressChange(e)}
                  className="w-full p-3 rounded-2xl bg-gray-100"
                />
              </div>
            )
          )}
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition duration-300"
          >
            Weiter
          </button>
        </form>
      </div>
    );
  };

  export default AddressForm;