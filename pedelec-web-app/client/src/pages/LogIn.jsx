import React, { useState, useEffect } from "react";
import MyInput from "../components/MyInput";
import PasswordInput from "../components/PasswordInput";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, errorMessage: authErrorMessage, loginMessage, logoutMessage, setErrorMessage } = useAuth();

  useEffect(() => {
    setErrorMessage("");
  }, [setErrorMessage]);

  

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="max-w-md mx-auto my-5 p-6 rounded-3xl backdrop-blur-lg shadow-lg">
      {!loginMessage && !logoutMessage ? (
        <form onSubmit={handleLogin}>
          <MyInput
            htmlFor="email"
            id="email"
            placeholder="E-Mail"
            type="email"
            value={email}
            setValue={setEmail}
          />
          <PasswordInput
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            value={password}
            setValue={setPassword}
          />
          {authErrorMessage && (
            <p className="text-red-500 mb-4">{authErrorMessage}</p>
          )}
          <button
            type="submit"
            className="p-3 w-full bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-600 mt-4"
          >
            Login
          </button>
          <p className="p-2 w-full text-gray-800 text-md">
            Haben Sie noch kein Konto?{" "}
            <Link
              to="/SignUp"
              className="text-blue-600 underline hover:cursor-pointer"
            >
              SignUp
            </Link>
          </p>
        </form>
      ) : (
        <div>
          {loginMessage && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
              {loginMessage}
            </div>
          )}
          {logoutMessage && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {logoutMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogIn;






