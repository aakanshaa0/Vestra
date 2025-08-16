import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminNavbar from './components/AdminNavbar';
import AdminFooter from './components/AdminFooter';

const AdminLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col m-0 p-0">
    <AdminNavbar />
    <main className="flex-grow bg-gray-50 m-0 p-0">
      {children}
    </main>
    <AdminFooter />
  </div>
);

function App() {
  return (
    <div className="m-0 p-0 w-full">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          } />
          <Route path="/products" element={
            <AdminLayout>
              <Products />
            </AdminLayout>
          } />
          <Route path="/orders" element={
            <AdminLayout>
              <Orders />
            </AdminLayout>
          } />
          <Route path="/profile" element={
            <AdminLayout>
              <Profile />
            </AdminLayout>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
