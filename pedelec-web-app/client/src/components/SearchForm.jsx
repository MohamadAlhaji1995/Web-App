import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchInput from './SearchInput';
import SelectBrand from './SelectBrand';
import PriceInput from './PriceInput';
import SearchButton from './SearchButton';

const SearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [brand, setBrand] = useState('');
  const [availableBrands, setAvailableBrands] = useState([]);
  const [color, setColor] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/search/brands')
      .then((response) => setAvailableBrands(response.data))
      .catch((error) => console.error('Fehler beim Abrufen der Marken:', error));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const searchParameter = {
      term: searchTerm,
      brand,
      color,
      minPrice,
      maxPrice,
    };

    axios
      .post('http://localhost:3001/api/search', searchParameter)
      .then((response) => onSearch(response.data))
      .catch((error) => console.error('Fehler beim Abrufen der Daten:', error));
  };

  return (
    <form
      onSubmit={handleSearch}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-2  rounded-lg  drop-shadow-2xl shadow-2xl   backdrop-blur-xl"
    >
      <SearchInput
        placeholder="Suche nach E-Bikes"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SelectBrand
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        brands={availableBrands}
      />
      <SearchInput
        placeholder="Farbe eingeben"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <PriceInput
        placeholder="Min. Preis"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        
      />
      <PriceInput
        placeholder="Max. Preis"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <SearchButton />
    </form>
  );
};

export default SearchForm;
