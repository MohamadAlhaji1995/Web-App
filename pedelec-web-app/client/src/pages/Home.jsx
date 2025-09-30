import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Suchen from "./SuchenPage";
import EBikeCard from "../components/EBikeCard";
import Pagination from "../components/Pagination";
import { fetchEBikes, addToCart, deleteBike } from "../services/ebikeService";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [eBikes, setEBikes] = useState([]);
  const [hoveredBike, setHoveredBike] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rentStartDate, setRentStartDate] = useState("");
  const [rentEndDate, setRentEndDate] = useState("");
  const [showRentDates, setShowRentDates] = useState(false);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  // Verwenden useAuth, um den Authentifizierungsstatus und die Rolle zu erhalten
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    loadEBikes();
  }, []);

  const loadEBikes = async () => {
    try {
      const eBikesData = await fetchEBikes();
      setEBikes(eBikesData);
    } catch (error) {
      console.error("Fehler beim Abrufen der E-Bikes:", error.message);
    }
  };

  const handleSearchResults = (results) => {
    setEBikes(results);
  };

  const handleMouseEnter = (bike) => setHoveredBike(bike);
  const handleMouseLeave = () => {
    setHoveredBike(null);
    setShowRentDates(false);
  };

  const handleAddToCart = async (bikeId) => {
    if (!isAuthenticated) {
      alert(
        "Sie müssen sich anmelden, um dieses Produkt zum Warenkorb hinzuzufügen."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const message = await addToCart(bikeId, token);
      alert(message);
    } catch (error) {
      console.error("Fehler beim Hinzufügen zum Warenkorb:", error);
      alert(
        "Fehler beim Hinzufügen zum Warenkorb. Bitte versuchen Sie es erneut."
      );
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Kein Token vorhanden");
      return;
    }
    try {
      await deleteBike(id, token);
      setEBikes(eBikes.filter((bike) => bike._id !== id));
    } catch (error) {
      console.error("Fehler beim Löschen des E-Bikes:", error.message);
    }
  };



  const handleBuyNow = (bike) => {
    navigate("/payment", { state: { bike, type: "buy" } });
  };

  const handleRent = (bike) => {
    if (!rentStartDate || !rentEndDate) {
      alert("Bitte wählen Sie sowohl ein Startdatum als auch ein Enddatum.");
      return;
    }

    const startDate = new Date(rentStartDate);
    const endDate = new Date(rentEndDate);
    const timeDiff = endDate - startDate;
    const rentalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (rentalDays <= 0) {
      alert("Das Enddatum muss nach dem Startdatum liegen.");
      return;
    }

    const confirmRent = window.confirm(
      `Sie mieten das E-Bike: ${
        bike.name
      }\nMietdauer: ${rentalDays} Tage\nGesamtmietpreis: ${
        bike.rent * rentalDays
      }€\nMöchten Sie fortfahren?`
    );

    if (confirmRent) {
      navigate("/payment", { state: { bike, type: "rent", rentalDays } });
    }
  };

  const handleShowRentDates = () => setShowRentDates(true);

  const paginatedEBikes = eBikes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-1">
      <Suchen onSearch={handleSearchResults} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-12 p-4">
      {paginatedEBikes.map((bike) => (
          <EBikeCard
            key={bike._id}
            bike={bike}
            hoveredBike={hoveredBike}
            isAuthenticated={isAuthenticated} 
            role={role} 
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleBuyNow={handleBuyNow}
            handleShowRentDates={handleShowRentDates}
            handleDelete={handleDelete}
            handleRent={handleRent}
            handleAddToCart={handleAddToCart}
            showRentDates={showRentDates}
            rentStartDate={rentStartDate}
            setRentStartDate={setRentStartDate}
            rentEndDate={rentEndDate}
            setRentEndDate={setRentEndDate}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(eBikes.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        specialStyle


      />
    </div>
  );
};

export default Home;
