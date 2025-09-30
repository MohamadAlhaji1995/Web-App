import React from "react";
import RentForm from "./RentForm";
import ActionButtons from "./ActionButtons";

const EBikeCard = ({
  bike,
  hoveredBike,
  isAuthenticated,
  role,
  handleMouseEnter,
  handleMouseLeave,
  handleBuyNow,
  handleShowRentDates,
  handleDelete,
  handleRent,
  handleAddToCart,
  showRentDates,
  rentStartDate,
  setRentStartDate,
  rentEndDate,
  setRentEndDate,
}) => {
  return (
    <div
      key={bike._id}
      className="relative p-2 bg-white/20 rounded-2xl text-center backdrop-blur-md"
      onMouseEnter={() => handleMouseEnter(bike)}
      onMouseLeave={handleMouseLeave}
    >
      {bike.imageUrl && (
        <img
          src={`http://localhost:3001${bike.imageUrl}`}
          alt={bike.name}
          className="w-full h-64 rounded-2xl object-cover"
        />
      )}
      {hoveredBike === bike && (
        <div className="absolute top-0 left-0 right-0 bg-white/80 p-3 rounded-2xl flex flex-col gap-0 backdrop-blur-sm">
          <h2 className="text-blue-800 font-semibold  ">
            {bike.name}
          </h2>
          <p>Farbe: {bike.color}</p>
          <p>Marke: {bike.brand}</p>
          <p>Preis: {bike.price}€</p>
          <p>Miete: {bike.rent}€/Tag</p>
          <p>Status: {bike.status}</p>

          {showRentDates && (
            <RentForm
              bike={bike}
              rentStartDate={rentStartDate}
              setRentStartDate={setRentStartDate}
              rentEndDate={rentEndDate}
              setRentEndDate={setRentEndDate}
              handleRent={handleRent}
            />
          )}

          <ActionButtons
            bike={bike}
            isAuthenticated={isAuthenticated}
            role={role}
            handleBuyNow={handleBuyNow}
            handleShowRentDates={handleShowRentDates}
            handleDelete={handleDelete}
          />

          {isAuthenticated && (
            <button
              className="py-2  border-2 border-green-600 text-green-600  rounded-2xl font-bold text-lg  hover:bg-green-100 mt-1 mix-blend-multiply  backdrop-blur-2xl"
              onClick={() => handleAddToCart(bike._id)}
            >
              Zum Warenkorb hinzufügen
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EBikeCard;
