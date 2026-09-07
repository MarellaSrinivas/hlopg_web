

import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Header from "./Header";
import "./StudentLogin.css";
import api from "../api.jsx";
import login from "../assets/students.jpeg";
import { FaEye, FaEyeSlash } from "react-icons/fa";



const StudentLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";
  const [showPassword, setShowPassword] = useState(false);

  
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  useEffect(() => {
    setError("");
    // const token = localStorage.getItem("hlopgToken");
    // const user = localStorage.getItem("hlopgUser");
    
    // if (token && user) {
    //   navigate("/");
    // }

    

  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const clearAuth = () => {
  localStorage.removeItem("hlopgToken");
  localStorage.removeItem("hlopgUser");
  localStorage.removeItem("hlopgOwner");
  localStorage.removeItem("hlopgRole");
};

    
    // Basic validation
    if (!formData.identifier.trim()) {
      setError("Email/Phone is required");
      setLoading(false);
      return;
    }
    
    if (!formData.password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }
    
    try {
      console.log("📤 Sending login request:", formData);
      
      const res = await api.post("/auth/login/user", formData);
      console.log("📥 Login response:", res.data);
      
      if (res.data.success) {
        const { token, user } = res.data.data;

       clearAuth();
        
        // Save to localStorage
        localStorage.setItem("hlopgToken", token);
        localStorage.setItem("hlopgRole", "USER");
        localStorage.setItem("hlopgUser", JSON.stringify(user));
        
        // Show success message
        alert("✅ Login successful!");
                window.dispatchEvent(new Event("loginSuccess"));

        
        // Navigate to dashboard
        navigate("/");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes("Network")) {
        setError("Cannot connect to server. Please check if backend is running.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <img src={login} alt="Login" />
      
      <div className="student-login-container">
        <h2>Student / Professional Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form className="student-login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Email or Phone Number"
            value={formData.identifier}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <div className="password-field">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
    disabled={loading}
  />

  <span
    className="toggle-password"
    onClick={() => setShowPassword((p) => !p)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>


          <div className="forgot-password">
            <Link to="/student-forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="student-signup-link">
          Don't have an account?{" "}
          <Link to="/student-signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;