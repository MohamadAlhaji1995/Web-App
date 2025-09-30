import React from "react";

const PasswordInput = ({ showPassword, setShowPassword, value, setValue }) => {
  return (
    <div className="mb-4 relative">
      <label htmlFor="password" className="block text-blue-800 mb-2">
        Passwort:
      </label>
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
      />
      <div
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-10 right-2 flex justify-center items-center cursor-pointer p-1 bg-transparent border-2 border-gray-300 rounded-full hover:bg-blue-100 hover:border-blue-500 transition duration-300"
      >
        {showPassword ? (
          <i className="fas fa-eye-slash text-gray-500 hover:text-gray-700 w-full h-full p-1"></i>
        ) : (
          <i className="fas fa-eye text-gray-500 hover:text-gray-700 w-full h-full p-1"></i>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
