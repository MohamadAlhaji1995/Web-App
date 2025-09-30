import React from 'react';
import SearchForm from '../components/SearchForm';

const SuchenPage = ({ onSearch }) => (
  <header className="p-5">
    <SearchForm onSearch={onSearch} />
  </header>
);

export default SuchenPage;
