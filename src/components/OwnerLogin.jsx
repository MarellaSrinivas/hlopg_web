import React, { useState, useEffect  } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header"; // ✅ Include header
import "./OwnerLogin.css";
import api from "../api.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";



 
const OwnerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
    const [error, setError] = useState(""); 
    const [loading, setLoading]=useState(false);

    const [showPassword, setShowPassword] = useState(false);

  
   useEffect(() => {
      setError("");
    
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  
  try {
    const res = await api.post("/auth/login/owner", formData);
    console.log("Owner login response:", res.data);
    
    if (res.data.success) {
      // ✅ FIX: Use the correct variable name
      const { token, owner } = res.data.data;
      
      clearAuth();

      localStorage.setItem("hlopgToken", token);
      localStorage.setItem("hlopgRole", "OWNER");
      localStorage.setItem("hlopgOwner", JSON.stringify(owner));
      
      
      // ✅ FIX: Log 'owner' not 'ownerData'
      console.log("✅ Owner logged in:", owner);
              window.dispatchEvent(new Event("loginSuccess"));

      navigate("/owner-dashboard");
    } else {
      setError(res.data.message || "Login failed");
    }
  } catch (err) {
    console.error("Owner login error:", err);
    const errorMsg = err.response?.data?.message || "Login failed";
    
    if (errorMsg.toLowerCase().includes("not an owner")) {
      setError("This account is not registered as an owner. Please use student login.");
    } else if (errorMsg.toLowerCase().includes("credentials")) {
      setError("Invalid email/phone or password");
    } else {
      setError(errorMsg);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <>
    
      <div className="owner-login-container">
        <h2>PG / Hostel Owner Login</h2>

        <form className="owner-login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Email Address"
            value={formData.identifier}
            onChange={handleChange}
            required
          />

          <div className="password-field">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
  />

  <span
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>


          <div className="forgot-password">
            <Link to="/owner-forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit">Log In</button>
        </form>
              {error && <p className="error-message">{error}</p>}

        <p className="owner-signup-link">
          Don’t have an account? <Link to="/ownersignup">Create Account</Link>
        </p>
      </div>
    </>
  );
};

export default OwnerLogin;
