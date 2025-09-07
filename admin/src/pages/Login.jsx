import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting admin login...');
      
      const response = await fetch(`${API_BASE_URL}/api/user/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Login response status:', response.status);
      
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (data.success) {
        console.log('Login successful, token received:', data.token ? 'Yes' : 'No');
        console.log('Token length:', data.token ? data.token.length : 'No token');
        console.log('Token preview:', data.token ? data.token.substring(0, 20) + '...' : 'No token');
        
        localStorage.setItem('admin_token', data.token);
        
        if (data.user) {
          localStorage.setItem('admin', JSON.stringify(data.user));
        } 
        else {
          const adminData = {
            name: 'Admin User',
            email: email,
            role: 'Super Admin',
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('admin', JSON.stringify(adminData));
        }
        
        console.log('💾 Token and admin data stored in localStorage');
        
        const storedToken = localStorage.getItem('admin_token');
        console.log('🔍 Stored token verification:', storedToken ? 'Token found' : 'No token found');
        
        navigate('/');
      } else {
        console.error('Login failed:', data.message);
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-center text-gray-800 mb-6 text-2xl font-semibold">Admin Login</h2>
        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-md mb-5 text-sm border border-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-base transition-colors duration-150 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-gray-700 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-base transition-colors duration-150 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gray-900 text-white p-3 rounded-md text-base font-medium cursor-pointer transition-all duration-200 hover:bg-gray-800 hover:transform hover:-translate-y-0.5 active:transform-none active:translate-y-0 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
