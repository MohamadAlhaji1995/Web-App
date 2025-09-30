import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import useSearch from "../src/services/hooks/useSearch";
import Home from "./pages/Home";
import Header from "./components/Header";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Dashboard from "./pages/Dashboard";
import ReparaturAnfrage from "./pages/ReparaturAnfragePage";
import Cart from "./pages/Cart";
import PaymentMethod from "./pages/PaymentMethod";
import RepZeigen from "./pages/RepZeigenPage";
import "./App.css";

function App() {
  const { isAuthenticated, role } = useAuth();
  const { searchResults, handleSearch } = useSearch();
  const [selectedBike, setSelectedBike] = useState(null);
  const handleBuyNow = (bike) => setSelectedBike(bike);

  return (
    <div className="App backBild min-h-screen">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              bikes={searchResults}
              onSearch={handleSearch}
              onBuyNow={handleBuyNow}
            />
          }
        />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        {isAuthenticated && role === "admin" && (
          <Route path="/Dashboard" element={<Dashboard />} />
        )}
        <Route path="/rep-zeigen" element={<RepZeigen />} />
        <Route path="/reparatur-anfrage" element={<ReparaturAnfrage />} />
        <Route
          path="/payment"
          element={<PaymentMethod bike={selectedBike} />}
        />
        <Route path="/warenkorb" element={<Cart />} />
      </Routes>
    </div>
  );
}

export default App;
