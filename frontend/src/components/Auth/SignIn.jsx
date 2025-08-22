import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);

        localStorage.setItem('token', data.token);
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          firstLogin: data.firstLogin
        }));

       //logic for if the store owner is logging in for first time
         if (data.role === "Store Owner") {
          if (data.firstLogin === 1) {
          setShowPopup(true);
          }
          navigate("/store-dashboard");
        }  
        else if (data.role === "Customer") {
          navigate("/customer-dashboard");
        }else if (data.role === "Store Administrator") {
          navigate("/admin-dashboard");
        }
        else{
          navigate("/admin-dashboard");
        }

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
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg hover:bg-white hover:text-black transition duration-200 shadow-md font-semibold"
          >
            Sign In
          </button>

          <p className="text-black text-center mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="underline font-semibold"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
  