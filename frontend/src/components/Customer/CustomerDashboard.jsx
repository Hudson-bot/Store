// CustomerDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});
  const navigate = useNavigate();

  const StarRatingInput = ({ storeId }) => {
    const rating = ratings[storeId] || 0;
    const hover = hoverRatings[storeId] || 0;

    const handleClick = async (value) => {
      setRatings((prev) => ({ ...prev, [storeId]: value }));
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/api/reviews",
          { storeId, rating: value },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    };

    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => {
          const value = index + 1;
          return (
            <button
              key={index}
              type="button"
              className="text-2xl focus:outline-none"
              onClick={() => handleClick(value)}
              onMouseEnter={() =>
                setHoverRatings((prev) => ({ ...prev, [storeId]: value }))
              }
              onMouseLeave={() =>
                setHoverRatings((prev) => ({ ...prev, [storeId]: 0 }))
              }
            >
              <span
                className={
                  value <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                }
              >
                ★
              </span>
            </button>
          );
        })}
        <span className="ml-2 text-gray-600 text-sm">{rating || 0}/5</span>
      </div>
    );
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

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
        const response = await axios.get("http://localhost:5000/api/store/all-stores", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStores(response.data); 
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Welcome {customerInfo?.name}, rate the stores below:
        </h2>

        <div className="space-y-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">
                {store.store_name}
              </h3>
              <p className="text-gray-600 mb-2">{store.store_type}</p>
              <p className="text-gray-600 mb-2">{store.address}</p>
              <StarRatingInput storeId={store.id} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
