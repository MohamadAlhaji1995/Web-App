import React, { useState, useEffect } from "react";
import axios from "axios";
import EBikeForm from "../components/EBikeForm";
import UserTable from "../components/UserTable";
import Pagination from "../components/Pagination";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [rent, setRent] = useState("");
  const [status, setStatus] = useState("verfügbar");
  const [image, setImage] = useState(null);

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [editingUser, setEditingUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    }
  };

  const handleSubmitEBike = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("color", color);
    data.append("brand", brand);
    data.append("price", price);
    data.append("rent", rent);
    data.append("status", status);
    if (image) data.append("image", image);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/api/ebikes", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("E-Bike erfolgreich hinzugefügt");
      resetForm();
    } catch (error) {
      setMessage("Fehler beim Hinzufügen des E-Bikes");
    }
  };

  const resetForm = () => {
    setName("");
    setColor("");
    setBrand("");
    setPrice("");
    setRent("");
    setStatus("verfügbar");
    setImage(null);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Fehler beim Löschen des Benutzers:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setUserData({ name: user.name, email: user.email, role: user.role });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/users/${editingUser}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === editingUser ? { ...user, ...userData } : user
        )
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Fehler beim Speichern der Benutzerdaten:", error);
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto p-1 backdrop-blur-lg">
      <h1 className="text-center text-2xl font-bold mb-4 text-blue-800">
        Admin Dashboard
      </h1>

      <div className="flex flex-col lg:flex-row justify-between gap-2">
        <div className="w-full lg:w-1/2">
          <EBikeForm
            name={name}
            setName={setName}
            color={color}
            setColor={setColor}
            brand={brand}
            setBrand={setBrand}
            price={price}
            setPrice={setPrice}
            rent={rent}
            setRent={setRent}
            status={status}
            setStatus={setStatus}
            image={image}
            setImage={setImage}
            handleSubmitEBike={handleSubmitEBike}
          />
        </div>

        <div className="w-full lg:w-2/3">
          <UserTable
            paginatedUsers={users.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
            handleSaveUser={handleSaveUser}
            editingUser={editingUser}
            setUserData={setUserData}
            userData={userData}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(users.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {message && (
        <p className="mt-4 text-center text-green-600 font-bold">{message}</p>
      )}
    </div>
  );
};

export default Dashboard;
