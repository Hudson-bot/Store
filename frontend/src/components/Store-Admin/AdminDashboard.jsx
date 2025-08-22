import React from "react";
import { useNavigate } from "react-router-dom";
import AddUserModal from "./AddUserModal";
import { useAdminDashboard } from "./useAdminDashboard";
import { SortIndicator } from "./SortIndicator";

const AdminDashboard = () => {
  const {
    // State
    stats,
    loading,
    activeTab,
    error,
    isAddUserModalOpen,
    userFilters,
    storeFilters,
    userSortConfig,
    storeSortConfig,
    sortedFilteredUsers,
    sortedFilteredStores,
    
    // Actions
    setActiveTab,
    setIsAddUserModalOpen,
    refreshUsers,
    handleLogout,
    requestUserSort,
    requestStoreSort,
    handleUserFilterChange,
    handleStoreFilterChange,
    clearFilters
  } = useAdminDashboard();
  
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 p-4">
        <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab("stats")}
            className={`py-2 px-3 text-left border-l-4 font-medium text-sm ${
              activeTab === "stats"
                ? "border-black text-gray-900 bg-gray-100"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`py-2 px-3 text-left border-l-4 font-medium text-sm ${
              activeTab === "users"
                ? "border-black text-gray-900 bg-gray-100"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("stores")}
            className={`py-2 px-3 text-left border-l-4 font-medium text-sm ${
              activeTab === "stores"
                ? "border-black text-gray-900 bg-gray-100"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Stores
          </button>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="py-2 px-3 text-left border-l-4 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Add User
          </button>
          <button
            onClick={() => navigate("/update-password")}
            className="mt-6 py-2 px-3 text-left border-l-4 border-transparent font-medium text-sm text-gray-600 hover:text-gray-900"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="py-2 px-3 text-left border-l-4 border-transparent font-medium text-sm text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Stats Overview */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total Users */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500">Total Users</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</dd>
                </div>
              </div>
            </div>
            {/* Total Stores */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500">Registered Stores</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.totalStores}</dd>
                </div>
              </div>
            </div>
            {/* Total Ratings */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500">Total Ratings</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.totalRatings}</dd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
       {activeTab === 'users' && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <span className="text-sm text-gray-600">{sortedFilteredUsers.length} users found</span>
            </div>
            
            {/* User Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Filter by name"
                  value={userFilters.name}
                  onChange={(e) => handleUserFilterChange('name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  placeholder="Filter by email"
                  value={userFilters.email}
                  onChange={(e) => handleUserFilterChange('email', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Filter by address"
                  value={userFilters.address}
                  onChange={(e) => handleUserFilterChange('address', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={userFilters.role}
                  onChange={(e) => handleUserFilterChange('role', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                  <option value="store_admin">Store Admin</option>
                </select>
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={() => clearFilters('users')}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestUserSort('name')}
                    >
                      <div className="flex items-center">
                        Name
                        <SortIndicator sortConfig={userSortConfig} sortKey="name" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestUserSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        <SortIndicator sortConfig={userSortConfig} sortKey="email" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestUserSort('address')}
                    >
                      <div className="flex items-center">
                        Address
                        <SortIndicator sortConfig={userSortConfig} sortKey="address" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestUserSort('role')}
                    >
                      <div className="flex items-center">
                        Role
                        <SortIndicator sortConfig={userSortConfig} sortKey="role" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedFilteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No users found matching your filters
                      </td>
                    </tr>
                  ) : (
                    sortedFilteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.address || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stores Table */}
        {activeTab === 'stores' && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Store Management</h2>
              <span className="text-sm text-gray-600">{sortedFilteredStores.length} stores found</span>
            </div>
            
            {/* Store Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input
                  type="text"
                  placeholder="Filter by store name"
                  value={storeFilters.store_name}
                  onChange={(e) => handleStoreFilterChange('store_name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  placeholder="Filter by owner name"
                  value={storeFilters.owner_name}
                  onChange={(e) => handleStoreFilterChange('owner_name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  placeholder="Filter by email"
                  value={storeFilters.email}
                  onChange={(e) => handleStoreFilterChange('email', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <input
                  type="text"
                  placeholder="Filter by rating"
                  value={storeFilters.rating}
                  onChange={(e) => handleStoreFilterChange('rating', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={() => clearFilters('stores')}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestStoreSort('store_name')}
                    >
                      <div className="flex items-center">
                        Store Name
                        <SortIndicator sortConfig={storeSortConfig} sortKey="store_name" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestStoreSort('owner_name')}
                    >
                      <div className="flex items-center">
                        Owner
                        <SortIndicator sortConfig={storeSortConfig} sortKey="owner_name" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestStoreSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        <SortIndicator sortConfig={storeSortConfig} sortKey="email" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestStoreSort('address')}
                    >
                      <div className="flex items-center">
                        Address
                        <SortIndicator sortConfig={storeSortConfig} sortKey="address" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestStoreSort('average_rating')}
                    >
                      <div className="flex items-center">
                        Rating
                        <SortIndicator sortConfig={storeSortConfig} sortKey="average_rating" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestStoreSort('total_reviews')}
                    >
                      <div className="flex items-center">
                        Reviews
                        <SortIndicator sortConfig={storeSortConfig} sortKey="total_reviews" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedFilteredStores.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No stores found matching your filters
                      </td>
                    </tr>
                  ) : (
                    sortedFilteredStores.map((store) => (
                      <tr key={store.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.store_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{store.owner_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{store.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{store.address || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm text-gray-600">
                              {typeof store.average_rating === 'number' ? store.average_rating.toFixed(1) : 'No ratings'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {store.total_reviews}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AddUserModal 
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={refreshUsers}
      />
    </div>
  );
};

export default AdminDashboard;
