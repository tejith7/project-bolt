import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Star, Edit2, Camera, Save, LogOut, Shield, CreditCard } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Profile: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, CA 94105',
    photo: user?.profilePicture || ''
  });
  
  // Payment methods
  const paymentMethods = [
    {
      id: 'card-1',
      type: 'visa',
      last4: '4242',
      expiry: '04/25',
      isDefault: true
    },
    {
      id: 'card-2',
      type: 'mastercard',
      last4: '5555',
      expiry: '07/26',
      isDefault: false
    }
  ];
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    setEditMode(false);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile header */}
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-6 sm:p-10 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-400 flex items-center justify-center border-4 border-white shadow-md">
                  <span className="text-white text-2xl font-bold">
                    {user?.name.charAt(0)}
                  </span>
                </div>
              )}
              
              {editMode && (
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                  <Camera className="h-4 w-4 text-blue-600" />
                </button>
              )}
            </div>
            
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">{user?.name}</h1>
              <p className="text-blue-100 mt-1">{user?.email}</p>
              <div className="flex items-center justify-center sm:justify-start mt-2">
                <Star className="h-4 w-4 text-yellow-300 fill-current" />
                <span className="ml-1 text-sm">{user?.rating.toFixed(1)} Rating</span>
                <span className="mx-2">•</span>
                <span className="text-sm">
                  {user?.type === 'rider' ? 'Rider' : 'Driver'} since 2023
                </span>
              </div>
            </div>
            
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 sm:mt-0 sm:ml-auto flex items-center py-2 px-4 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Tab navigation */}
        <div className="border-b">
          <nav className="flex overflow-x-auto -mb-px">
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-4 w-4 inline mr-2" />
              Profile
            </button>
            
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'payment'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('payment')}
            >
              <CreditCard className="h-4 w-4 inline mr-2" />
              Payment Methods
            </button>
            
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('security')}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Security
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {/* Profile tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editMode}
                        className={`block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          !editMode ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!editMode}
                        className={`block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          !editMode ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!editMode}
                        className={`block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          !editMode ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!editMode}
                        className={`block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          !editMode ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Saved addresses */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Home
                            </span>
                          </div>
                          <p className="mt-1 text-gray-700">123 Main St, Anytown, CA 94105</p>
                        </div>
                        {editMode && (
                          <button className="text-gray-500 hover:text-gray-700">
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Work
                            </span>
                          </div>
                          <p className="mt-1 text-gray-700">456 Market St, Anytown, CA 94103</p>
                        </div>
                        {editMode && (
                          <button className="text-gray-500 hover:text-gray-700">
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {editMode && (
                      <button className="mt-2 text-blue-600 font-medium text-sm hover:text-blue-500">
                        + Add new address
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Action buttons */}
                {editMode && (
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 inline mr-1" />
                      Save Changes
                    </button>
                  </div>
                )}
                
                {!editMode && (
                  <div className="mt-8 border-t pt-6">
                    <button
                      onClick={handleLogout}
                      className="flex items-center py-2 px-4 text-red-600 rounded-md font-medium hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
          
          {/* Payment methods tab */}
          {activeTab === 'payment' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-12 mr-4">
                        {method.type === 'visa' ? (
                          <span className="text-blue-600 font-bold text-xl">VISA</span>
                        ) : (
                          <span className="text-red-600 font-bold text-xl">MC</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {method.type.charAt(0).toUpperCase() + method.type.slice(1)} ending in {method.last4}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires {method.expiry}
                          {method.isDefault && (
                            <span className="ml-2 text-green-600 font-medium">Default</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button className="inline-flex items-center py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 hover:bg-blue-50">
                  + Add Payment Method
                </button>
              </div>
            </div>
          )}
          
          {/* Security tab */}
          {activeTab === 'security' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              
              {/* Change password */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium mb-4 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-gray-500" />
                  Password
                </h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="pt-3">
                    <button
                      type="button"
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Two-factor authentication */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-gray-500" />
                    Two-Factor Authentication
                  </h4>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle"
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor="toggle"
                      className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    ></label>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Add an extra layer of security to your account by requiring a verification code in addition to your password.
                </p>
              </div>
              
              {/* Session management */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium mb-4">Active Sessions</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <div>
                      <p className="font-medium">This Device</p>
                      <p className="text-sm text-gray-500">Last active: Just now</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Current
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">iPhone 13 Pro</p>
                      <p className="text-sm text-gray-500">Last active: 2 days ago</p>
                    </div>
                    <button className="text-red-600 hover:text-red-500 text-sm font-medium">
                      Log out
                    </button>
                  </div>
                </div>
                <button className="mt-4 text-blue-600 hover:text-blue-500 text-sm font-medium">
                  Log out of all devices
                </button>
              </div>
              
              {/* Account deletion */}
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
                <p className="text-sm text-red-600 mb-4">
                  Once you delete your account, there is no going back. This action cannot be undone.
                </p>
                <button className="py-2 px-4 border border-red-600 rounded-md text-sm font-medium text-red-600 hover:bg-red-100">
                  Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;