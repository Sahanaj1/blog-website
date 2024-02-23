import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const isPremium = localStorage.getItem('isPremium');
    const userId = localStorage.getItem('userId');
    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    if (token) {
      return { token, username, isPremium, userId, firstname, lastname };
    }
    return null;
  });

  const login = (userData) => {
    setUser(userData);

    localStorage.setItem('token', userData.token);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('firstname', userData.firstname);
    localStorage.setItem('lastname', userData.lastname);
    localStorage.setItem('isPremium', userData.isPremium);
    localStorage.setItem('userId', userData.userId);
  };

  const updateUserData = (userData) => {
    if (userData) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('token', updatedUser.token);
      localStorage.setItem('username', updatedUser.username);
      localStorage.setItem('firstname', updatedUser.firstname);
      localStorage.setItem('lastname', updatedUser.lastname);
      localStorage.setItem('isPremium', updatedUser.isPremium);
      localStorage.setItem('userId', updatedUser.userId);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('isPremium');
    localStorage.removeItem('userId');
  };

  const getToken = () => {
    return user?.token || '';
  };

  useEffect(() => {
    if (user?.token) {
      try {
        const tokenData = JSON.parse(atob(user.token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000;
        if (Date.now() >= expirationTime) {
          logout();
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (localStorage.getItem('isPremium') !== user.isPremium) {
        localStorage.setItem('isPremium', user.isPremium);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
