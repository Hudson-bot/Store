// StoreDashboard.jsx
import { useState, useEffect } from "react";
import PopUp from "./PopUp";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StoreDashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFirstLoginAndLoadStoreInfo = async () => {
      try {

        const userData = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        if (!userData || !token) {
          console.error("User not authenticated");
          navigate("/signin");
          return;
        }

        // Checking
        if (userData.role !== "Store Owner") {
          alert("Access denied. Only Store Owners can access this dashboard.");
          navigate("/signin");
          return;
        }

        // Check if this is the first login
        if (userData.firstLogin === 1) {
          console.log("First time user detected, showing popup");
          setShowPopup(true);
        } else {
          console.log("Existing user detected, popup hidden");
          setShowPopup(false);
        }

        try {
          const response = await axios.get("http://localhost:5000/api/store/store-info", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data && !response.data.message) {
            setStoreInfo(response.data);
            setShowPopup(false);
            const updatedUser = { ...userData, firstLogin: 0 };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error("Error loading store info:", error);
          }
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    checkFirstLoginAndLoadStoreInfo();
  }, [navigate]);

  const handlePopupClose = () => {
    setShowPopup(false);
    refreshStoreInfo();
  };

  const refreshStoreInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:5000/api/store/store-info", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && !response.data.message) {
        setStoreInfo(response.data);
        setShowPopup(false);
      }
    } catch (error) {
      console.error("Error refreshing store info:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {showPopup && <PopUp onClose={handlePopupClose} />}
      
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 p-6 border-r border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Store Information</h2>
          <button
            onClick={handleLogout}
            className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
          >
            Logout
          </button>
        </div>
        {storeInfo ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Name</p>
              <p className="text-black font-semibold">{storeInfo.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Store Name</p>
              <p className="text-black font-semibold">{storeInfo.store_name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Address</p>
              <p className="text-black">{storeInfo.address}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Phone</p>
              <p className="text-black">{storeInfo.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Type</p>
              <p className="text-black">{storeInfo.store_type}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-gray-500 text-sm">No store information available yet.</p>
            <button
              onClick={() => setShowPopup(true)}
              className="mt-2 bg-black text-white px-3 py-1 rounded text-xs hover:bg-gray-800 transition-colors"
            >
              Complete Setup
            </button>
          </div>
        )}
      </div>

      {/* Right Side  */}
      <div className="flex-1 p-8 bg-white">
        <div className="max-w-4xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              {storeInfo ? `Welcome, ${storeInfo.name}` : 'Store Dashboard'}
            </h1>
            <p className="text-gray-600">
              {storeInfo 
                ? `Manage your store "${storeInfo.store_name}"`
                : 'Complete your store setup to begin'
              }
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-black mb-2">Store Overview</h2>
                <div className="w-16 h-1 bg-black mx-auto mb-4"></div>
              </div>
              
              {storeInfo ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">Owner Name</p>
                    <p className="text-2xl font-bold text-black">{storeInfo.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">Store Name</p>
                    <p className="text-2xl font-bold text-black">{storeInfo.store_name}</p>
                  </div>
                  
                  
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏪</div>
                  <h3 className="text-xl font-semibold text-black mb-2">Store Setup Required</h3>
                  <p className="text-gray-600 mb-6">Complete your store information to unlock the dashboard</p>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Start Setup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;