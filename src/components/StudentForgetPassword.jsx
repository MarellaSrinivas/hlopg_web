// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./StudentForgetPassword.css";

// const StudentForgetPassword = () => {
//   const [email, setEmail] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // TODO: Replace with real password reset logic
//     alert(`Password reset link sent to ${email}`);
//   };

//   return (
//     <div className="student-forget-container">
//       <h2 className="student-forget-title">Forgot Password</h2>
//       <p className="student-forget-subtitle">
//         Enter Your registered email to reset your password
//       </p>

//       <form className="student-forget-form" onSubmit={handleSubmit}>
//         <label htmlFor="email">Email Address</label>
//         <input
//           type="email"
//           id="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <button type="submit">Send Reset Link</button>
//       </form>

//       <div className="student-forget-back">
//         <Link to="/student-login">Back to Login</Link>
//       </div>
//     </div>
//   );
// };

// export default StudentForgetPassword;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StudentForgetPassword.css";
import api from "../api.jsx";

const StudentForgetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [phone, setPhone] = useState(""); // Will be set from backend

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      console.log("📤 Requesting password reset for:", email);
      
      const res = await api.post("/auth/forgot-password", { email });
      console.log("📥 Forgot password response:", res.data);
      
      if (res.data.success) {
        setPhone(res.data.data.phone);
        setSuccess("OTP sent to your registered phone number: " + res.data.data.phone);
        setStep(2);
      } else {
        setError(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      setError(err.response?.data?.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    
    if (otpCode.length !== 4) {
      setError("Please enter 4-digit OTP");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      console.log("🔐 Verifying OTP:", otpCode);
      
      const res = await api.post("/auth/verify-otp", {
        identifier: phone,
        otpCode: otpCode,
        purpose: "PASSWORD_RESET"
      });
      
      console.log("📥 OTP verification response:", res.data);
      
      if (res.data.success) {
        setSuccess("OTP verified! Please set new password.");
        setStep(3);
      } else {
        setError(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("❌ OTP verification error:", err);
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      console.log("🔐 Resetting password for:", phone);
      
      const res = await api.post("/auth/reset-password", {
        identifier: phone,
        otpCode: otp.join(""),
        newPassword: newPassword
      });
      
      console.log("📥 Reset password response:", res.data);
      
      if (res.data.success) {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/studentlogin");
        }, 2000);
      } else {
        setError(res.data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("❌ Reset password error:", err);
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setError("");
    setLoading(true);
    
    try {
      const res = await api.post("/auth/resend-otp", {
        identifier: phone,
        purpose: "PASSWORD_RESET"
      });
      
      if (res.data.success) {
        setSuccess("OTP resent successfully!");
        setOtp(["", "", "", ""]);
      } else {
        setError(res.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("❌ Resend OTP error:", err);
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-forget-container">
      <h2 className="student-forget-title">Forgot Password</h2>
      
      {step === 1 && (
        <>
          <p className="student-forget-subtitle">
            Enter your registered email to reset password
          </p>
          
          <form className="student-forget-form" onSubmit={handleSubmitEmail}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </>
      )}
      
      {step === 2 && (
        <>
          <p className="student-forget-subtitle">
            Enter OTP sent to: {phone}
          </p>
          
          <form className="student-forget-form" onSubmit={handleSubmitOTP}>
            <label htmlFor="otp">4-Digit OTP</label>
            <div className="otp-inputs">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/, "");
                    const newOtp = [...otp];
                    newOtp[index] = value[0] || "";
                    setOtp(newOtp);
                    
                    // Auto-focus next
                    if (value && index < 3) {
                      document.getElementById(`otp-${index + 1}`)?.focus();
                    }
                  }}
                  id={`otp-${index}`}
                  required
                />
              ))}
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button 
                type="button" 
                className="secondary-btn"
                onClick={resendOTP}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        </>
      )}
      
      {step === 3 && (
        <>
          <p className="student-forget-subtitle">
            Set your new password
          </p>
          
          <form className="student-forget-form" onSubmit={handleSubmitNewPassword}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
            
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </>
      )}
      
      <div className="student-forget-back">
        <Link to="/studentlogin">Back to Login</Link>
      </div>
    </div>
  );
};

export default StudentForgetPassword;