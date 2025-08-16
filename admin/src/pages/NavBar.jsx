import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav style={{ padding: 16, background: '#222', color: '#fff', display: 'flex', gap: 24 }}>
      <Link style={{ color: '#fff', textDecoration: 'none' }} to="/dashboard">Dashboard</Link>
      <Link style={{ color: '#fff', textDecoration: 'none' }} to="/products">Products</Link>
      <Link style={{ color: '#fff', textDecoration: 'none' }} to="/users">Users</Link>
    </nav>
  );
}
