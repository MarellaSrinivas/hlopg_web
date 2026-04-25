import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import adminImage from "../../assets/admin-login.jpeg";
import { FaUserShield } from "react-icons/fa";
import api from "../../api";
 
 
const AdminLogin = () => {
  const navigate = useNavigate();
 
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async (e) => {
    e.preventDefault();
 
    if (!userId || !password) {
      alert("Please enter User ID and Password");
      return;
    }
 
    try {
      setLoading(true);
 
      const res = await api.post(
  "/admin/auth/login",
  {
    userId,
    password,
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

const result = res.data; 
      if (result.success) {
        // ✅ Store JWT token
        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("adminData", JSON.stringify(result.admin));
 
        alert("Login Successful!");
 
        // ✅ Redirect to Admin Dashboard
        navigate("/admin/");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Admin Login Error:", error);
      alert(
        error.response?.data?.message || "Invalid Credentials"
      );
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
 
        {/* Left Image Section */}
        <div className="admin-image-section">
          <img src={adminImage} alt="Admin Login" />
        </div>
 
        {/* Right Form Section */}
        <div className="admin-form-section">
          <h1 className="admin-title">Super Admin</h1>
 
          <form className="login-card" onSubmit={handleLogin}>
            <div className="brand">
              <div className="brand-icon">
                <FaUserShield />
              </div>
              <h2>Hlo PG</h2>
            </div>
 
            <input
              type="text"
              placeholder="User ID"
              className="login-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
 
            <input
              type="password"
              placeholder="Enter Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
 
            <button className="login-bttn" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
 
      </div>
    </div>
  );
};
 
export default AdminLogin;
