// useStoreDashboard.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useStoreDashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [storeInfo, setStoreInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

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

  return {
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
  };
};