import React from "react";
import { useNavigate } from "react-router-dom";
import PopUp from "./PopUp";
import { useStoreDashboard } from "./useStoreDashboard";
import { StarRatingDisplay } from "./StarRatingDisplay";

const StoreDashboard = () => {
  const {
    // State
    showPopup,
    storeInfo,
    reviews,
    loading,
    averageRating,
    // Actions
    setShowPopup,
    handlePopupClose,
    handleLogout
  } = useStoreDashboard();
  
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 ">
      {showPopup && <PopUp onClose={handlePopupClose} />}

      {/*Left*/}
      <div className="w-80 bg-white border-r border-gray-200 shadow-sm p-6">
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Dashboard</h2>
            <div className="w-12 h-1 bg-gray-900"></div>
          </div>
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
        </div>
      </div>

      {/* Right*/}
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
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
            {reviews.length > 0 && (
              <div className="flex flex-col items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-4">
                <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
                <div className="flex mt-2">
                  <StarRatingDisplay rating={averageRating} />
                </div>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
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
                    <div className="mt-4 pt-4 border border-gray-100">
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