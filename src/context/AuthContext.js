// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Здесь можно добавить запрос для проверки токена
      setIsAuthenticated(true);
      // Декодировать JWT чтобы получить данные пользователя
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    const userData = JSON.parse(atob(token.split('.')[1]));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear()
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;