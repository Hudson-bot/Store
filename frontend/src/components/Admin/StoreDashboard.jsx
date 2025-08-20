// StoreDashboard.jsx
import { useState, useEffect } from "react";
import PopUp from "./PopUp";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StoreDashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [storeInfo, setStoreInfo] = useState(null);
  const [reviews, setReviews] = useState([]); 
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

        if (userData.role !== "Store Owner") {
          alert("Access denied. Only Store Owners can access this dashboard.");
          navigate("/signin");
          return;
        }

        // Popup check
        if (userData.firstLogin === 1) {
          setShowPopup(true);
        }

        // Load store info
        try {
          const response = await axios.get("http://localhost:5000/api/store/store-info", {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data && !response.data.message) {
            setStoreInfo(response.data);
            setShowPopup(false);

            // Update user in localStorage
            const updatedUser = { ...userData, firstLogin: 0 };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error("Error loading store info:", error);
          }
        }

        // Load store reviews
        try {
          const res = await axios.get("http://localhost:5000/api/review/owner/reviews", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setReviews(res.data);
        } catch (error) {
          console.error("Error loading reviews:", error);
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
        headers: { Authorization: `Bearer ${token}` }
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

      {/* Right Side */}
      <div className="flex-1 p-8 bg-white overflow-y-auto">
        <div className="max-w-4xl mx-auto">

          {/* Store Overview */}
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

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
            <h2 className="text-2xl font-semibold text-black mb-4">Customer Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((rev) => (
                  <li key={rev.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <strong className="text-black">{rev.customer_name}</strong>
                      <span className="text-yellow-500 font-bold">⭐ {rev.rating}</span>
                    </div>
                    <p className="text-gray-700 mt-2">{rev.comment}</p>
                    <small className="text-gray-500">
                      {new Date(rev.created_at).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
