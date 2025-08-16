import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg m-0 p-0 w-full">
      <div className="w-full m-0 px-8 h-16 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white no-underline">
          Admin Panel
        </Link>

        <div className="hidden md:flex gap-6">
          <Link 
            to="/" 
            className={`text-gray-300 no-underline font-medium py-2 border-b-2 border-transparent transition-all duration-200 hover:text-white hover:border-gray-100 ${
              location.pathname === '/' ? 'text-white border-gray-100' : ''
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/products" 
            className={`text-gray-300 no-underline font-medium py-2 border-b-2 border-transparent transition-all duration-200 hover:text-white hover:border-gray-100 ${
              location.pathname === '/products' ? 'text-white border-gray-100' : ''
            }`}
          >
            Products
          </Link>
          <Link 
            to="/orders" 
            className={`text-gray-300 no-underline font-medium py-2 border-b-2 border-transparent transition-all duration-200 hover:text-white hover:border-gray-100 ${
              location.pathname === '/orders' ? 'text-white border-gray-100' : ''
            }`}
          >
            Orders
          </Link>
          <Link 
            to="/profile" 
            className={`text-gray-300 no-underline font-medium py-2 border-b-2 border-transparent transition-all duration-200 hover:text-white hover:border-gray-100 ${
              location.pathname === '/profile' ? 'text-white border-gray-100' : ''
            }`}
          >
            Profile
          </Link>
        </div>

        <button 
          className="bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 hover:bg-red-700" 
          onClick={handleLogout}
        >
          Logout
        </button>

        <button 
          className="md:hidden bg-none border-none text-white text-2xl cursor-pointer" 
          onClick={toggleMenu}
        >
          ☰
        </button>
      </div>

      <div className={`md:hidden bg-gray-800 p-4 absolute top-16 left-0 right-0 z-50 shadow-lg ${
        isMenuOpen ? 'block' : 'hidden'
      }`}>
        <Link 
          to="/" 
          className="block text-gray-300 py-3 border-b border-gray-600 no-underline hover:text-white" 
          onClick={() => setIsMenuOpen(false)}
        >
          Dashboard
        </Link>
        <Link 
          to="/products" 
          className="block text-gray-300 py-3 border-b border-gray-600 no-underline hover:text-white" 
          onClick={() => setIsMenuOpen(false)}
        >
          Products
        </Link>
        <Link 
          to="/orders" 
          className="block text-gray-300 py-3 border-b border-gray-600 no-underline hover:text-white" 
          onClick={() => setIsMenuOpen(false)}
        >
          Orders
        </Link>
        <Link 
          to="/profile" 
          className="block text-gray-300 py-3 border-b border-gray-600 no-underline hover:text-white" 
          onClick={() => setIsMenuOpen(false)}
        >
          Profile
        </Link>
        <button 
          className="block text-gray-300 py-3 w-full text-left cursor-pointer hover:text-white bg-none border-none text-base" 
          onClick={() => {
            handleLogout();
            setIsMenuOpen(false);
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
