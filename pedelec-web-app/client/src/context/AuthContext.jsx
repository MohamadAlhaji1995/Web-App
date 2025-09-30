import { createContext, useContext, useState, useEffect } from "react";
import { register, loginApi } from "../services/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  // Authentifizierungszustand, Benutzerrolle und Name werden als State-Variablen verwaltet.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState(""); 

  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      // Login-Response abfragen
      const loginResponse = await loginApi(email, password);
      if (loginResponse.status === 200) {
        // Token und Benutzerdaten speichern
        const { token, role, name } = loginResponse.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);

        // Zustände setzen
        setIsAuthenticated(true);
        setRole(role);
        setUserName(name);
        setEmail(email);

        // Login-Nachricht setzen
        setLoginMessage(`Sie sind erfolgreich angemeldet!`);

        setTimeout(() => {
          if (role === "admin") {
            navigate("/Dashboard");
          } else {
            navigate("/");
          }
        }, 1000);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Benutzername oder Passwort ist nicht korrekt");
      } else {
        setErrorMessage(
          "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut."
        );
      }
    }
  };

  const registerAndLogin = async (name, email, password) => {
    try {
      const registerResponse = await register(name, email, password);
      if (registerResponse.status === 201) {
        await login(email, password); // Automatisch einloggen nach Registrierung
        setSuccessMessage(
          `Sie haben sich erfolgreich registriert und angemeldet. Willkommen, ${name}!`
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut."
        );
      }
    }
  };

  const logout = () => {
    // Token und Benutzerinformationen aus dem Speicher entfernen
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    // Zustände zurücksetzen
    setIsAuthenticated(false);
    setRole("");
    setUserName("");
    setLoginMessage("");
    navigate("/LogIn");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
      setUserName(name);
      setEmail(email);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        userName,
        login,
        logout,
        registerAndLogin,
        errorMessage,
        loginMessage,
        successMessage,
        setErrorMessage,
        email,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
