import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./OwnerSignup.css";
import api from "../api.jsx";


const OwnerSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [apiError, setApiError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [loading, setLoading] = useState(false);
const [otpLoading, setOtpLoading] = useState(false);


  const phoneRef = useRef(null);
  const emailRef = useRef(null);


  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9,11}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  // Countdown for resend OTP
  useEffect(() => {
    let interval;
    if (showOTPModal && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOTPModal, resendTimer]);

  // Field validation
  const validateField = (name, value) => {
    let message = "";
    let isValid = false;

    switch (name) {
      case "name":
        if (!value.trim()) message = "Name is required.";
        else if (value.trim().length < 3) message = "Name must be at least 3 characters.";
        else if (value.trim().length > 22) message = "Name cannot exceed 22 characters.";
        else isValid = true;
        break;

      case "email":
        if (!emailRegex.test(value)) {
          message = "Enter a valid email address.";
        } else if (
          !value.endsWith("@gmail.com") &&
          !value.endsWith("@outlook.com")
        ) {
          message = "Only Gmail or Outlook email addresses are allowed.";
        } else {
          isValid = true;
        }
        break;

      case "phone":
        if (!/^\d*$/.test(value)) message = "Phone number must contain only digits.";
        else if (!phoneRegex.test(value))
          message = "Enter valid Indian phone number (10–12 digits).";
        else isValid = true;
        break;

      case "password":
        if (!passwordRegex.test(value))
          message = "Min 6 chars, must include letters & numbers.";
        else isValid = true;
        break;

      case "confirmPassword":
        if (value !== formData.password) message = "Passwords do not match.";
        else isValid = true;
        break;

      default:
        isValid = true;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    setValidFields((prev) => ({ ...prev, [name]: isValid }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);

    // Clear API error if relevant field is edited
    if ((name === "phone" && apiError.includes("Phone")) ||
        (name === "email" && apiError.includes("Email"))) {
      setApiError("");
    }
  };

  // Send OTP
  const sendOTP = () => {
    setShowOTPModal(true);
    setResendTimer(30);
    setCanResend(false);
    setOtpValues(["", "", "", ""]);
    setOtpError("");

    setTimeout(() => {
      if (otpRefs[0]?.current) {
        otpRefs[0].current.focus();
      }
    }, 100);
  };

  // Submit signup
 const handleSubmit = async (e) => {
  e.preventDefault();
  setApiError("");
  setLoading(true);
  
  // Validate all fields
  Object.keys(formData).forEach((key) => validateField(key, formData[key]));
  
   if (Object.values(validFields).some((v) => !v)) {
      setLoading(false);
      return;
    }

  try {
    // Prepare data for backend - CORRECT STRUCTURE
    const signupData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    };
    
    console.log("Sending owner signup:", signupData);
    
    // ✅ CORRECT ENDPOINT: /api/auth/register/owner
    const res = await api.post("/auth/register/owner", signupData);
    console.log("Owner registration response:", res.data);
    
    if (res.data.success) {
      console.log("✅ Owner registered! OTP sent.");
  // Store test OTP in localStorage for debugging
  // localStorage.setItem('testOTP', '1234');
  localStorage.setItem('ownerPhone', formData.phone);
      sendOTP();
    } else {
      setApiError(res.data.message || "Registration failed");
    }
  } catch (err) {
    console.error("Owner signup error:", err);
    const backendMsg = err.response?.data?.message || "Registration failed";
    
    if (backendMsg.toLowerCase().includes("email")) {
        setApiError("Email already registered. Please use another email.");
        setTimeout(() => {
          if (emailRef.current) {
            emailRef.current.focus();
          }
        }, 100);
      } else if (backendMsg.toLowerCase().includes("phone")) {
        setApiError("Phone number already exists. Please use another number.");
        setTimeout(() => {
          if (phoneRef.current) {
            phoneRef.current.focus();
          }
        }, 100);
      } else {
        setApiError(backendMsg);
      }
    } finally {
      setLoading(false);
    }
};

  

const verifyOTP = async (e) => {
  e.preventDefault();
  const enteredOTP = otpValues.join("");
  setOtpLoading(true);
  setOtpError("");

  try {
    console.log("🔐 Verifying OTP:", enteredOTP);
    
    // Verify OTP only
    const res = await api.post("/auth/verify-otp", {
      identifier: formData.phone,
      otpCode: enteredOTP,
      purpose: "REGISTRATION",
    });
    
    console.log("✅ OTP verification response:", res.data);
    
    if (res.data.success) {
      // ✅ OTP verified successfully
      console.log("✅ OTP Verified! Registration complete.");
      
      // Clear OTP modal
      setShowOTPModal(false);
      
      // Show success message
      alert("✅ Registration successful! OTP verified. Please login to continue.");
      
      // ✅ Navigate to OwnerLogin page
      navigate("/ownerlogin");
    } else {
      setOtpError(res.data.message || "Invalid OTP");
    }
  } catch (err) {
    console.error("❌ OTP verification error:", err);
    setOtpError("OTP verification failed. Please try again.");
  } finally {
    setOtpLoading(false);
  }
};
const verifyWithGeneralEndpoint = async (enteredOTP) => {
  try {
    console.log("🔄 Trying general OTP endpoint...");
    const res = await api.post("/auth/verify-otp", {
      identifier: formData.phone,
      otpCode: enteredOTP,
      purpose: "REGISTRATION",
    });
    
    if (res.data.success) {
      // Try to auto-login
      try {
        const loginRes = await api.post("/auth/login/owner", {
          identifier: formData.email,
          password: formData.password
        });
        
        if (loginRes.data.success) {
          const { token, owner } = loginRes.data.data;
          localStorage.setItem("hlopgToken", token);
          localStorage.setItem("hlopgOwner", JSON.stringify(owner));
          alert("✅ Registration successful! You are now logged in.");
          setShowOTPModal(false);
          navigate("/ownerlogin");
        } else {
          alert("✅ Registration successful! Please login manually.");
          navigate("/ownerlogin");
        }
      } catch (loginErr) {
        console.error("Auto-login failed:", loginErr);
        alert("✅ Registration successful! Please login.");
        navigate("/ownerlogin");
      }
    } else {
      setOtpError(res.data.message || "Invalid OTP");
    }
  } catch (fallbackErr) {
    console.error("General endpoint also failed:", fallbackErr);
    // Show test OTP hint
    setOtpError(`OTP verification failed. For testing, use OTP: 1234`);
  }
};

  // Handle OTP input change
  const handleOTPChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, "");
    const newOtpValues = [...otpValues];
    newOtpValues[idx] = val[0] || "";
    setOtpValues(newOtpValues);

    if (val && idx < 3 && otpRefs[idx + 1]?.current) {
      otpRefs[idx + 1].current.focus();
    }
    if (!val && idx > 0 && otpRefs[idx - 1]?.current) {
      otpRefs[idx - 1].current.focus();
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    setOtpLoading(true);
    setOtpError("")
    try {
      const res = await api.post("/auth/resend-otp", {
        identifier: formData.phone,
        purpose: "REGISTRATION",
      });
      
      if (res.data.success) {
        setResendTimer(30);
        setCanResend(false);
        setOtpValues(["", "", "", ""]);
        
        setTimeout(() => {
          if (otpRefs[0]?.current) {
            otpRefs[0].current.focus();
          }
        }, 100);
        
      setOtpError("✅ OTP resent successfully!");
    } else {
      setOtpError(res.data.message || "Failed to resend OTP");
    }
  } catch (err) {
    console.error("Resend OTP error:", err);
    setOtpError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
  }finally {
    setOtpLoading(false);
  }
};

  return (
    <>
      <div className="owner-signup-container">
        <h2>PG / Hostel Owner Signup</h2>

        <form className="owner-signup-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-with-status">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={validFields.name ? "valid-input" : errors.name ? "invalid-input" : ""}
              required
            />
            {validFields.name && <span className="valid-tick">✓</span>}
          </div>

          {/* Email */}
          <div className="input-with-status">
            <input
              ref={emailRef}
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={validFields.email ? "valid-input" : errors.email ? "invalid-input" : ""}
              required
            />
            {validFields.email && <span className="valid-tick">✓</span>}
          </div>

          {/* Phone */}
          <div className="input-with-status">
            <input
              ref={phoneRef}
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={validFields.phone ? "valid-input" : errors.phone ? "invalid-input" : ""}
              required
            />
            {validFields.phone && <span className="valid-tick">✓</span>}
          </div>

          {/* Password */}
          <div className="input-with-status">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={validFields.password ? "valid-input" : errors.password ? "invalid-input" : ""}
              required
            />
            {validFields.password && <span className="valid-tick">✓</span>}
          </div>

          {/* Confirm Password */}
          <div className="input-with-status">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={validFields.confirmPassword ? "valid-input" : errors.confirmPassword ? "invalid-input" : ""}
              required
            />
            {validFields.confirmPassword && <span className="valid-tick">✓</span>}
          </div>

          {/* Validation messages */}
          {Object.values(errors).some((msg) => msg) && (
            <div className="error-message">
              {Object.values(errors).filter((msg) => msg).map((msg, i) => (
                <div key={i}>• {msg}</div>
              ))}
            </div>
          )}

          {apiError && <p className="error-message">{apiError}</p>}

          <button type="submit" disabled={loading}>
  {loading ? "Registering..." : "Sign Up"}
</button>
        </form>

        <p className="owner-login-link">
          Already have an account? <Link to="/ownerlogin">Log in</Link>
        </p>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <h3>Enter OTP</h3>
            <p>An OTP has been sent to your phone: {formData.phone}</p>
            <form onSubmit={verifyOTP} className="otp-form">
              <div className="otp-inputs">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    value={val}
                    ref={otpRefs[idx]}
                    onChange={(e) => handleOTPChange(e, idx)}
                    required
                  />
                ))}
              </div>
              {otpError && <p className="otp-error-message">{otpError}</p>}
              <div className="otp-actions">
                <button type="submit" disabled={otpLoading}>
  {otpLoading ? "Verifying..." : "Verify OTP"}
</button>
                <button type="button" className="otp-cancel-btn" onClick={() => setShowOTPModal(false)}>
                  Cancel
                </button>
              </div>
              <div className="resend-section">
                <button type="button" disabled={!canResend} onClick={resendOTP}>
                  Resend OTP {canResend ? "" : `(${resendTimer}s)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerSignup;
