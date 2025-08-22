// useAdminDashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [error, setError] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Filter states
  const [userFilters, setUserFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });
  const [storeFilters, setStoreFilters] = useState({
    owner_name: '',
    store_name: '',
    email: '',
    rating: ''
  });

  // Sorting states
  const [userSortConfig, setUserSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [storeSortConfig, setStoreSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsRes = await fetch("http://localhost:5000/api/admin/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch users
        const usersRes = await fetch("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const usersData = await usersRes.json();
        setUsers(usersData);

        // Fetch stores
        const storesRes = await fetch("http://localhost:5000/api/admin/stores", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!storesRes.ok) {
          throw new Error(`Stores API returned ${storesRes.status}`);
        }
        const storesData = await storesRes.json();
        setStores(Array.isArray(storesData) ? storesData : []);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setStores([]); // Ensure stores is always an array
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshUsers = async () => {
    try {
      const usersRes = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const usersData = await usersRes.json();
      setUsers(usersData);
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  // Request user sort
  const requestUserSort = (key) => {
    let direction = 'ascending';
    if (userSortConfig.key === key && userSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setUserSortConfig({ key, direction });
  };

  // Request store sort
  const requestStoreSort = (key) => {
    let direction = 'ascending';
    if (storeSortConfig.key === key && storeSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setStoreSortConfig({ key, direction });
  };

  // Sort users based on sort configuration
  const getSortedUsers = (items) => {
    if (!userSortConfig.key) return items;
    
    return [...items].sort((a, b) => {
      // Handle null/undefined values by treating them as empty strings
      const aValue = a[userSortConfig.key] || '';
      const bValue = b[userSortConfig.key] || '';
      
      if (aValue < bValue) {
        return userSortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return userSortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Sort stores based on sort configuration
  const getSortedStores = (items) => {
    if (!storeSortConfig.key) return items;
    
    return [...items].sort((a, b) => {
      // Special handling for numeric fields like rating
      if (storeSortConfig.key === 'average_rating' || storeSortConfig.key === 'total_reviews') {
        const aValue = parseFloat(a[storeSortConfig.key]) || 0;
        const bValue = parseFloat(b[storeSortConfig.key]) || 0;
        
        if (aValue < bValue) {
          return storeSortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return storeSortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      }
      
      // For string fields
      const aValue = a[storeSortConfig.key] || '';
      const bValue = b[storeSortConfig.key] || '';
      
      if (aValue < bValue) {
        return storeSortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return storeSortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter users based on filter criteria
  const filteredUsers = users.filter(user => {
    return (
      (!userFilters.name || user.name?.toLowerCase().includes(userFilters.name.toLowerCase())) &&
      (!userFilters.email || user.email?.toLowerCase().includes(userFilters.email.toLowerCase())) &&
      (!userFilters.address || user.address?.toLowerCase().includes(userFilters.address.toLowerCase())) &&
      (!userFilters.role || user.role?.toLowerCase().includes(userFilters.role.toLowerCase()))
    );
  });

  // Filter stores based on filter criteria
  const filteredStores = stores.filter(store => {
    return (
      (!storeFilters.store_name || store.store_name?.toLowerCase().includes(storeFilters.store_name.toLowerCase())) &&
      (!storeFilters.owner_name || store.owner_name?.toLowerCase().includes(storeFilters.owner_name.toLowerCase())) &&
      (!storeFilters.email || store.email?.toLowerCase().includes(storeFilters.email.toLowerCase())) &&
      (!storeFilters.rating || String(store.average_rating || '').includes(storeFilters.rating))
    );
  });

  // Get sorted and filtered users
  const sortedFilteredUsers = getSortedUsers(filteredUsers);

  // Get sorted and filtered stores
  const sortedFilteredStores = getSortedStores(filteredStores);

  // Handle user filter changes
  const handleUserFilterChange = (field, value) => {
    setUserFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle store filter changes
  const handleStoreFilterChange = (field, value) => {
    setStoreFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear all filters
  const clearFilters = (type) => {
    if (type === 'users') {
      setUserFilters({ name: '', email: '', address: '', role: '' });
      setUserSortConfig({ key: null, direction: 'ascending' });
    } else {
      setStoreFilters({ name: '', email: '', address: '', rating: '' });
      setStoreSortConfig({ key: null, direction: 'ascending' });
    }
  };

  return {
    // State
    stats,
    users,
    stores,
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
  };
};