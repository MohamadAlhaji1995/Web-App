import React from 'react';

const Dropdown = ({ isOpen, toggleDropdown, handleLogout, userName, role, email }) => {
  return (
    <div className="dropdown relative">
      <button
        onClick={toggleDropdown}
        className="text-blue-900 bg-transparent px-2 py-2 rounded-2xl border-2 border-blue-500 shadow-md hover:bg-blue-200 flex items-center"
      >
        <i className="fas fa-user"></i>
        <span className="ml-2 hidden xl:inline">Profil</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 text-black-600"> 
          <p className="border-b-2 border-blue-300 py-2 text-blue-950">Hallo: {userName}</p> 
          <p className="border-b-2 border-blue-300 py-2  text-blue-950">Ihre E-Mail: {email}</p>   
          <p className="border-b-2 border-blue-300 py-2  text-blue-950">Rolle: {role}</p> 
          </div>
          <button
            onClick={handleLogout}
            className="relative px-5 py-3 font-bold text-red-600 bg-transparent rounded-lg overflow-hidden group "
          >
            <span className="relative z-10 flex items-center gap-2">
              <i className="fas fa-sign-out-alt "></i> Log Out
            </span>
            <div className="absolute inset-0 bg-red-200 rounded-2xl   translate-x-full group-hover:translate-x-0 transition-transform "></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
