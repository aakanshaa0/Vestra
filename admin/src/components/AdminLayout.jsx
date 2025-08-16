import React from 'react';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-grow pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <AdminFooter />
    </div>
  );
}
