import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { phone, purpose } = location.state || {};

  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    try {
      const res = await api.post("/auth/verify-otp", {
        phone,
        otp,
        purpose,
      });

      if (res.data.success) {
        alert("Verified successfully");

        navigate("/"); // or dashboard
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("OTP verification failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Verify OTP</h2>
      <p>Sent to: {phone}</p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default VerifyOTP;