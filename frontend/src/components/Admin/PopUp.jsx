// FirstTimePopup.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PopUp = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    storeName: "",
    address: "",
    phone: "",
    storeType: "",
  });
  
  const navigate = useNavigate();

  console.log("PopUp component rendered - showing first-time user setup form");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get the token and user data from localStorage
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !userData) {
        alert("You need to be logged in to save store info");
        navigate("/signin");
        return;
      }

      // Send data to backend with authorization header
      await axios.post("http://localhost:5000/api/store/store-info", 
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // After saving store info, update user's firstLogin status
      await axios.patch("http://localhost:5000/api/auth/setupComplete", 
        { userId: userData.id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update localStorage user data
      const updatedUser = { ...userData, firstLogin: 0 };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      console.log("Store setup completed successfully, user firstLogin updated to 0");

      alert("Store info saved successfully ✅");
      
      if (typeof onClose === 'function') {
        onClose(); // Close popup if onClose function is provided
      }
      
      // Navigate to dashboard (the popup will be hidden)
      navigate("/store-dashboard");
      
    } catch (error) {
      console.error("Error saving store info:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/signin");
      } else {
        alert("Failed to save store info ❌");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Complete Your Store Info</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="storeName"
            placeholder="Store Name"
            value={formData.storeName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="storeType"
            value={formData.storeType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Store Type</option>
            <option value="grocery">Grocery</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
          </select>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopUp;