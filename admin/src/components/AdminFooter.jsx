import React from 'react';
import { Link } from 'react-router-dom';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-10 m-0 w-full">
      <div className="w-full m-0 px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Admin Panel</h3>
              <p className="text-sm text-gray-400">Manage your e-commerce store with ease</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link to="/" className="text-gray-400 no-underline text-sm transition-colors duration-200 hover:text-white">
                Dashboard
              </Link>
              <Link to="/products" className="text-gray-400 no-underline text-sm transition-colors duration-200 hover:text-white">
                Products
              </Link>
              <Link to="/orders" className="text-gray-400 no-underline text-sm transition-colors duration-200 hover:text-white">
                Orders
              </Link>
            </div>
          </div>

          <hr className="border-0 h-px bg-gray-700 m-6" />

          <div className="flex flex-col gap-4 text-center md:flex-row md:justify-between md:items-center md:text-left">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Admin Panel. All rights reserved.
            </p>
            <div className="flex justify-center gap-6 md:justify-end">
              <Link to="/privacy" className="text-gray-400 no-underline text-sm transition-colors duration-200 hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 no-underline text-sm transition-colors duration-200 hover:text-white">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 no-underline text-sm transition-colors duration-200 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
