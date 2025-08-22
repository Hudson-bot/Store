// useCustomerDashboard.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useCustomerDashboard = () => {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        if (!userData || !token) {
          navigate("/signin");
          return;
        }

        if (userData.role !== "Customer") {
          alert("Access denied. Only Customers can access this dashboard.");
          navigate("/signin");
          return;
        }

        setCustomerInfo(userData);
        await fetchStores(token, userData.id);
      } catch (error) {
        console.error("Error in useEffect:", error);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [navigate]);

  const fetchStores = async (token, customerId) => {
    try {
      // Fetching stores
      const response = await axios.get("http://localhost:5000/api/store/all-stores", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const storesWithReviews = await Promise.all(
        response.data.map(async (store) => {
          try {
            // Fetching user reviews
            const reviewResponse = await axios.get(
              `http://localhost:5000/api/review/stores/${store.id}/user-review`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            return {
              ...store,
              userReview: reviewResponse.data
            };
          } catch (error) {
            return {
              ...store,
              userReview: null
            };
          }
        })
      );
      
      setStores(storesWithReviews);
    } catch (error) {
      console.error("Error loading stores:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/signin");
  };

  const openReviewModal = (store) => {
    setSelectedStore(store);
    setReviewText(store.userReview?.comment || "");
    setReviewRating(store.userReview?.rating || 0);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
  };

  const submitReview = async () => {
    if (!reviewRating) {
      alert("Please select a rating");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        "http://localhost:5000/api/review/reviews",
        {
          storeId: selectedStore.id,
          rating: reviewRating,
          comment: reviewText
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Refresh stores data to get updated ratings
      const userData = JSON.parse(localStorage.getItem('user'));
      await fetchStores(token, userData.id);
      
      setShowReviewModal(false);
      alert(selectedStore.userReview ? "Review updated successfully!" : "Review submitted successfully!");
      
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  return {
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
  };
};