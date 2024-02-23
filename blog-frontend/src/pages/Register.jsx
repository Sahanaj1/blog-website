import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {notifySuccess,notifyError,notifyWarning} from "../components/Notify"

const Register = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!username || !firstname || !lastname || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, firstname, lastname, password }),
      });

      if (response.ok) {
        const userData = { username, firstname, lastname, password };
        // login(userData);
        navigate('/login');
        notifySuccess("Registration successful")
      } else {
        setError('Registration failed. Please try again.');
        notifyError("Registration failed. Please try again.")
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
      notifyError("Registration failed. Please try again.")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
      {/* <ToastContainer /> */}
          <h2 className="text-2xl font-semibold mb-4">Register</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            type="text"
            placeholder="Firstname"
            value={firstname}
            required={true}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Lastname"
            value={lastname}
            required={true}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            required={true}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button
            onClick={handleRegister}
            className="w-full bg-blue-500 text-white font-semibold p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
       
      </div>
    </div>
  );
};

export default Register;
