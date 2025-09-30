import React from "react";

const SearchButton = ({ onClick }) => (
  <button
    type="submit"
    onClick={onClick}
    className="p-2 bg-transparent border-2 border-blue-500 rounded-lg text-blue-600 hover:bg-blue-100 hover:border-blue-500 hover:text-blue-500 font-bold "
  >
    Suchen
  </button>
);

export default SearchButton;
