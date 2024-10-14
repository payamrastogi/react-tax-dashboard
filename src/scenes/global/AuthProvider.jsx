import React from "react";
import { useState } from "react";

export const AuthContext = React.createContext({
  isLoggedIn: false,
  user: null,
  credentials: null,
});

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState(null);

  const login = (user, credentials) => {
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("credentials", credentials);
    setCredentials(credentials);
    setUser(user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("credentials");
    localStorage.removeItem("user");
    setCredentials(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, credentials, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
