import React from "react";
import MyInput from "./MyInput";

const StatusSelect = ({ status, setStatus }) => {
  return (
    <div className="mb-2">
      <label htmlFor="status" className="block mb-1 text-blue-800">
        Status:
      </label>
      <select
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-3 rounded-2xl bg-gray-100"
      >
        <option value="verfügbar">verfügbar</option>
        <option value="ausgeliehen">ausgeliehen</option>
        <option value="verkauft">verkauft</option>
      </select>
    </div>
  );
};

const ImageUpload = ({ image, setImage }) => {
  return (
    <div className="mb-2">
      <label htmlFor="image" className="block  text-blue-800">
        Bild:
      </label>
      <input
        type="file"
        id="image"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full p-3 rounded-2xl bg-gray-100"
      />
    </div>
  );
};

const EBikeForm = ({
  name,
  setName,
  color,
  setColor,
  brand,
  setBrand,
  price,
  setPrice,
  rent,
  setRent,
  status,
  setStatus,
  image,
  setImage,
  handleSubmitEBike,
}) => {
  return (
    <form
      className="w-full ml-auto p-1 bg-white/20 rounded-2xl "
      onSubmit={handleSubmitEBike}
    >
      <MyInput
        htmlFor="name"
        id="name"
        placeholder="Name"
        type="text"
        value={name}
        setValue={setName}
      />
      <MyInput
        htmlFor="color"
        id="color"
        placeholder="Farbe"
        type="text"
        value={color}
        setValue={setColor}
      />
      <MyInput
        htmlFor="brand"
        id="brand"
        placeholder="Marke"
        type="text"
        value={brand}
        setValue={setBrand}
      />
      <MyInput
        htmlFor="price"
        id="price"
        placeholder="Preis"
        type="number"
        value={price}
        setValue={(value) => {
          if (/^\d*\.?\d*$/.test(value)) setPrice(value); 
        }}
      />
      <MyInput
        htmlFor="rent"
        id="rent"
        placeholder="Miete"
        type="number"
        value={rent}
        setValue={(value) => {
          if (/^\d*\.?\d*$/.test(value)) setRent(value); 
        }}
      />
      <StatusSelect status={status} setStatus={setStatus} />
      <ImageUpload image={image} setImage={setImage} />
      <button
        type="submit"
        className="w-full p-2 bg-transparent text-blue-500 border-2 border-blue-500 rounded-2xl font-bold text-lg hover:bg-blue-100 hover:border-blue-500 hover:text-blue-500 transition duration-300 transform"
      >
        E-Bike hinzufügen
      </button>
    </form>
  );
};

export default EBikeForm;
