import React, { useState } from "react";
import { Link } from "react-router-dom";
import { menuItems } from "../config/menuConfig";
import logo from "../assets/logo2.png";
import Dropdown from "./Dropdown";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, role, userName, logout, email } = useAuth();

  // Funktion zum Umschalten des Dropdown-Menüs
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gray-600/40 p-2">
      <div className="mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Pedelec-Shop-Logo"
            className="h-20   rounded-full shadow-lg ml-0 hidden xl:inline"
          />
        </Link>
        <ul className="flex items-center space-x-2 relative">
          {menuItems.map((item) => {
            if (item.adminOnly && role !== "admin") return null;

            if (item.authenticated && !isAuthenticated) return null;

            return (
              <li key={item.path} className={item.path}>
                <Link
                  to={item.path}
                  className="text-blue-900 bg-transparent px-2 py-2 rounded-2xl border-2 border-blue-500  hover:bg-blue-200"
                >
                  <i className={item.icon}></i>
                  <span className="ml-2 hidden xl:inline">{item.label}</span>
                </Link>
              </li>
            );
          })}

          {isAuthenticated && (
            <Dropdown
              isOpen={dropdownOpen}
              toggleDropdown={toggleDropdown}
              handleLogout={handleLogout}
              userName={userName}
              role={role}
              email={email}
            />
          )}

          {!isAuthenticated && (
            <>
              <li>
                <Link
                  to="/SignUp"
                  className="text-blue-900 bg-transparent px-2 py-2 rounded-2xl border-2 border-blue-500 hover:bg-blue-200"
                >
                  <i className="fas fa-user-plus"></i>
                  <span className="ml-2 hidden xl:inline">SignUp</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/LogIn"
                  className="text-blue-900 bg-transparent px-2 py-2 rounded-2xl border-2 border-blue-500 shadow-md hover:bg-blue-200"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span className="ml-2 hidden xl:inline">Login</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
