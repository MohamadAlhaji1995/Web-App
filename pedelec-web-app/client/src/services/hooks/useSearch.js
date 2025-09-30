import { useState, useEffect } from "react";
import axios from "axios";

const useSearch = () => {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/eBikes")
      .then((response) => setSearchResults(response.data))
      .catch((error) => console.error("Fehler beim Laden der Daten:", error));
  }, []);

  const handleSearch = (searchTerm, navigate) => {
    axios
      .post("http://localhost:3001/api/search", { term: searchTerm })
      .then((response) => {
        setSearchResults(response.data);
        navigate("/");
      })
      .catch((error) => console.error("Fehler bei der Suche:", error));
  };

  return { searchResults, handleSearch };
};

export default useSearch;
