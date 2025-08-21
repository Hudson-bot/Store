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

  // Check for first time user or not
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

        if (userData.firstLogin === 1) {
          setShowPopup(true);
        }

        try {
          const response = await axios.get("http://localhost:5000/api/store/store-info", {
            headers: { Authorization: `Bearer ${token}` }
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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {showPopup && <PopUp onClose={handlePopupClose} />}

      {/* Left Side - Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-sm p-6">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Dashboard</h2>
            <div className="w-12 h-1 bg-gray-900"></div>
          </div>

          {/* Navigation */}
          <div className="space-y-3 mb-8 space-x-4">
            <button
              onClick={handleLogout}
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors font-medium"
            >
              <span className="font-medium">Logout</span>
              
            </button>
            
            <button
              onClick={() => navigate("/update-password")}
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors font-medium"
            >
              <span className="font-medium">Change Password</span>
            </button>
          </div>

          {/* Store Information */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
            
            {storeInfo ? (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Name</p>
                  <p className="text-gray-900 font-medium">{storeInfo.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Store Name</p>
                  <p className="text-gray-900 font-medium">{storeInfo.store_name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Address</p>
                  <p className="text-gray-700">{storeInfo.address}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-gray-700">{storeInfo.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Type</p>
                  <p className="text-gray-700 capitalize">{storeInfo.store_type}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-gray-500 text-sm mb-3">No store information available</p>
                <button
                  onClick={() => setShowPopup(true)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors font-medium"
                >
                  Complete Setup
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2024 Store Manager
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Main Content */}
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {storeInfo ? `Welcome back, ${storeInfo.name}` : 'Store Dashboard'}
                </h1>
                <p className="text-gray-600">
                  {storeInfo
                    ? `Manage your store "${storeInfo.store_name}" and track customer feedback`
                    : 'Complete your store setup to begin managing your business'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Feedback from your customers
                </p>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-gray-700 font-medium text-sm">
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500 text-sm">
                  Customer reviews will appear here once they start rating your store.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{rev.customer_name}</h4>
                        <p className="text-gray-500 text-sm">
                          {new Date(rev.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-gray-900 font-medium text-sm">
                          ⭐ {rev.rating}/5
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{rev.comment}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Posted at {new Date(rev.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;