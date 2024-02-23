import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-blue-300 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            Blog-App
          </Link>
          <ul className="flex space-x-4 items-center">
            
            {user ? (
            <>
            <li>
              <Link to="/" className="text-white hover:text-gray-200">
                Feed
              </Link>
            </li>
            <li>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-200 cursor-pointer"
                >
                  Logout
                </button>
              </li>
              <li>
              <div>
              <div className="flex items-center">
              <Link to="/profile" className="text-white hover:text-gray-200">
              <div className="flex items-center">
                <div className='border rounded-full p-1'>
                <img
                  src={"https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} // Replace with the URL of the user's avatar
                  alt={`${user?.username}'s avatar`}
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                />
                </div>
                <div className="text-white font-bold text-lg cursor-pointer ml-2">{user?.username}</div>
                </div>
                </Link>
              </div>
              </div>
            </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-white hover:text-gray-200">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-white hover:text-gray-200">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
