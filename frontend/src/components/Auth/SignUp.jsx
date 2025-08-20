import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (formData.name.length < 10 || formData.name.length > 60) {
      newErrors.name = "Name must be between 20 and 60 characters.";
    }

    if (formData.address.length > 400) {
      newErrors.address = "Address cannot exceed 400 characters.";
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,16}$/;
    if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        "Password must be 8-16 characters, include 1 uppercase letter and 1 special character.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        navigate("/signin");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border-2 border-white">
        {/* Back Arrow Button */}
        <button
          type="button"
          onClick={() => navigate("/signin")}
          className="mb-4 flex items-center text-black hover:text-blue-600 transition"
        >
          <span className="mr-2 text-xl">&#8592;</span> {/* Unicode left arrow */}
          <span className="font-medium">Back to Sign In</span>
        </button>
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-black mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white text-black ${
                errors.name ? "border-red-500" : "border-black"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-black mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white text-black ${
                errors.email ? "border-red-500" : "border-black"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-black mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white text-black ${
                errors.address ? "border-red-500" : "border-black"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          <div>
            <label className="block text-black mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white text-black ${
                errors.password ? "border-red-500" : "border-black"
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-black mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white text-black ${
                errors.confirmPassword ? "border-red-500" : "border-black"
              }`}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-black mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white text-black border-black"
              required
            >
              <option value="">Select Role</option>
              <option value="Store Administrator">Store Administrator</option>
              <option value="Customer">Customer</option>
              <option value="Store Owner">Store Owner</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg hover:bg-white hover:text-black transition duration-200 shadow-md font-semibold"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
