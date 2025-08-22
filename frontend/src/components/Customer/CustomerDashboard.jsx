// CustomerDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerDashboard } from "./useCustomerDashboard";
import { StarRatingDisplay, StarRatingInput } from "./StarRating";

const CustomerDashboard = () => {
  const {
    // State
    customerInfo,
    stores,
    loading,
    selectedStore,
    showReviewModal,
    reviewText,
    reviewRating,
    hoverRating,
    
    // Actions
    setReviewText,
    setReviewRating,
    setHoverRating,
    handleLogout,
    openReviewModal,
    closeReviewModal,
    submitReview
  } = useCustomerDashboard();
  
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
              {customerInfo && (
                <p className="text-gray-600 mt-1">Hello, {customerInfo.name}</p>
              )}
            </div>
            <button
              onClick={() => navigate("/update-password")}
              className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome back{customerInfo ? `, ${customerInfo.name}` : ''}!
          </h2>
          <p className="text-gray-600">
            Discover amazing stores and share your experiences with others.
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Featured Stores</h2>
            <span className="text-gray-500 text-sm">
              {stores.length} stores available
            </span>
          </div>

          {stores.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No stores available</h3>
              <p className="mt-2 text-gray-500">There are currently no stores to display.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store, idx) => (
                <div key={`${store.id}-${idx}`} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mt-1 capitalize">
                          {store.type}
                        </span>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-700 font-semibold text-lg">
                          {store.type === 'grocery' ? '🛒' : 
                          store.type === 'electronics' ? '📱' : '👕'}
                        </span>
                      </div>
                    </div>
                    
                    <StarRatingDisplay rating={store.rating} />
                    
                    <div className="mt-2 text-sm text-gray-600">
                      {store.review_count || 0} reviews
                      {store.userReview && (
                        <span className="ml-2 text-gray-700 font-medium">• You reviewed this store</span>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <button 
                        onClick={() => openReviewModal(store)}
                        className="w-full bg-gray-900 text-white py-2 px-4 rounded-md text-sm hover:bg-gray-800 transition-colors font-medium"
                      >
                        {store.userReview ? 'Update Review' : 'Write a Review'}
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-50 transition-colors font-medium">
                        Visit Store
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 border border-gray-200 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedStore.userReview ? 'Update Your Review' : 'Review'} {selectedStore.name}
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <StarRatingInput 
                rating={reviewRating}
                setRating={setReviewRating}
                hoverRating={hoverRating}
                setHoverRating={setHoverRating}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this store..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                rows="4"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeReviewModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium"
              >
                {selectedStore.userReview ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;