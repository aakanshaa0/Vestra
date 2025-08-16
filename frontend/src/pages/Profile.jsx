import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

export default function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: ''
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
  const { setCartItems } = useContext(ShopContext);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const userProfileData = {
          name: userData.name || userData.username || 'User',
          email: userData.email || 'user@example.com'
        };

        setUserData(userProfileData);
        setEditForm({
          name: userProfileData.name,
          email: userProfileData.email
        });
      } else {
        const fallbackData = {
          name: 'User',
          email: 'user@example.com'
        };
        setUserData(fallbackData);
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
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const updatedData = {
        ...userData,
        name: editForm.name,
        email: editForm.email
      };

      setUserData(updatedData);
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUserData = {
          ...userData,
          name: editForm.name,
          email: editForm.email
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setCartItems({});
    
    navigate('/');
    
    alert('Logged out successfully!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/*Header*/}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and information</p>
        </div>

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
          {/*Profile Card*/}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">
                    {userData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                <p className="text-gray-600">Customer</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900 font-medium">{userData.email}</span>
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

          {/*Profile Details*/}
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
                       <p className="text-lg text-gray-900">{userData.name}</p>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-600 mb-2">
                         Email Address
                       </label>
                       <p className="text-lg text-gray-900">{userData.email}</p>
                     </div>
                   </div>

                  
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
