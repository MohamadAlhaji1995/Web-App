import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MyInput from "../components/MyInput";
import PasswordInput from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext"; 


const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { registerAndLogin, errorMessage,successMessage, setErrorMessage } = useAuth(); 

  useEffect(() => {
    setErrorMessage("");
  }, [setErrorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerAndLogin(name, email, password); 
   
  };

  return (
    <div className="max-w-md mx-auto my-5 p-6 rounded-3xl backdrop-blur-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <MyInput
          htmlFor="name"
          id="name"
          placeholder="Name"
          type="text"
          value={name}
          setValue={setName}
        />
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

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="flex justify-between">
          <button
            type="submit"
            className="p-3 w-full bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-300 mt-4"
          >
            Sign Up
          </button>
        </div>
        <p className="p-2 w-full text-gray-800 text-md">
        Haben Sie ein Konto?{" "}
          <Link to="/logIn" className="text-blue-600 underline hover:cursor-pointer">
            Login
          </Link>
        </p>
      </form>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default SignUp;
