import React from "react";

const MButton = ({
  title,
  handleClick,
  textColor,
  hoverBgColor,
  borderColor,
  backgroundColer,
}) => {
  return (
    <button
      className={`px-4 py-2 border ${borderColor} ${textColor} rounded-2xl text-sm hover:${hoverBgColor} ${backgroundColer}  `}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

const ActionButtons = ({
  bike,
  isAuthenticated,
  role,
  handleBuyNow,
  handleShowRentDates,
  handleDelete,
}) => {
  return (
    <div className="flex justify-center space-x-2">
      {isAuthenticated ? (
        <>
          <MButton
            title="Kaufen"
            handleClick={() => handleBuyNow(bike)}
            textColor=" text-green-600 border-2 font-bold text-lg"
            hoverBgColor="bg-green-100 mix-blend-multiply"
            borderColor="border-green-600"
          />
          <MButton
            title="Mieten"
            handleClick={handleShowRentDates}
            textColor="text-green-600 border-2 font-bold text-lg"
            hoverBgColor="bg-green-100 mix-blend-multiply"
            borderColor="border-green-600"
          />
          {role === "admin" && (
            <MButton
              title="Löschen"
              textColor="text-red-600 border-2 font-bold text-lg "
              hoverBgColor="bg-red-100  mix-blend-multiply"
              borderColor="border-red-600"
              handleClick={() => handleDelete(bike._id)}
            />
          )}
        </>
      ) : (
        <p className="text-l border-2 border-red-600 rounded-2xl text-red-600  ">
          Bitte loggen Sie sich ein, um weitere Funktionen nutzen zu können!
        </p>
      )}
    </div>
  );
};

export default ActionButtons;
