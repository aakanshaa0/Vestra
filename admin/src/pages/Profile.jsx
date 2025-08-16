import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    role: 'Admin',
    joinDate: '',
    lastLogin: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const storedAdmin = localStorage.getItem('admin');
      if (storedAdmin) {
        const adminData = JSON.parse(storedAdmin);
        const adminProfileData = {
          name: adminData.name || adminData.username || 'Admin User',
          email: adminData.email || 'admin@forever.com',
          role: adminData.role || 'Super Admin',
          joinDate: adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          lastLogin: new Date().toLocaleDateString()
        };

        setAdminData(adminProfileData);
        setEditForm({
          name: adminProfileData.name,
          email: adminProfileData.email
        });
      } 
      else {
        const fallbackData = {
          name: 'Admin User',
          email: 'admin@forever.com',
          role: 'Super Admin',
          joinDate: new Date().toLocaleDateString(),
          lastLogin: new Date().toLocaleDateString()
        };
        setAdminData(fallbackData);
        setEditForm({
          name: fallbackData.name,
          email: fallbackData.email
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: adminData.name,
      email: adminData.email
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: adminData.name,
      email: adminData.email
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const updatedData = {
        ...adminData,
        name: editForm.name,
        email: editForm.email
      };

      setAdminData(updatedData);
      
      const storedAdmin = localStorage.getItem('admin');
      if (storedAdmin) {
        const adminData = JSON.parse(storedAdmin);
        const updatedAdminData = {
          ...adminData,
          name: editForm.name,
          email: editForm.email
        };
        localStorage.setItem('admin', JSON.stringify(updatedAdminData));
      }
      
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
      setLoading(false);
    } catch (err) {
      setError('Failed to update profile');
      setLoading(false);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/*Header*/}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
        <p className="text-gray-600">Manage your account settings and information</p>
      </div>

      {/*Success/Error Message*/}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-white">
                  {adminData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{adminData.name}</h2>
              <p className="text-gray-600">{adminData.role}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900 font-medium">{adminData.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Join Date:</span>
                <span className="text-gray-900">{adminData.joinDate}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Last Login:</span>
                <span className="text-gray-900">{adminData.lastLogin}</span>
              </div>
            </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
          </div>
        </div>

        {/*Profile*/}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Profile' : 'Profile Details'}
              </h3>
              {isEditing && (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Full Name
                    </label>
                    <p className="text-lg text-gray-900">{adminData.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Email Address
                    </label>
                    <p className="text-lg text-gray-900">{adminData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Role
                    </label>
                    <p className="text-lg text-gray-900">{adminData.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Join Date
                    </label>
                    <p className="text-lg text-gray-900">{adminData.joinDate}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
