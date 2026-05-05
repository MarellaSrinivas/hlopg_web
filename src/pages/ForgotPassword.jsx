import React, { useState, useRef, useEffect } from "react";
import api from "../api";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  const [timer, setTimer] = useState(60);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // TIMER
  useEffect(() => {
    if (step !== 2 || timer === 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  // SEND OTP
  const sendOtp = async () => {
    setLoading(true);
    await api.post("/auth/forgot-password", { phone });
    setStep(2);
    setTimer(60);
    setLoading(false);
  };

  // OTP INPUT
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }

    if (newOtp.join("").length === 4) {
      verifyOtp(newOtp.join(""));
    }
  };

  // VERIFY OTP
  const verifyOtp = async (code) => {
    await api.post("/auth/verify-reset-otp", {
      identifier: phone,
      otpCode: code,
      purpose: "PASSWORD_RESET",
    });
    setStep(3);
  };

  // RESET PASSWORD
  const resetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await api.post("/auth/reset-password", {
      identifier: phone,
      otpCode: otp.join(""),
      newPassword: password,
    });

    alert("Password updated successfully");
    window.location.href = "/login";
  };

  return (
    <div className="forgot-container">
      <div className="card">

        {step === 1 && (
          <>
            <h2>Reset Password</h2>
            <p>Enter your mobile number</p>

            <input
              type="text"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button onClick={sendOtp}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Enter OTP</h2>
            <p>Sent to {phone}</p>

            <div className="otp-row">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(ref) => (inputs.current[i] = ref)}
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                />
              ))}
            </div>

            <p>{timer > 0 ? `00:${timer}` : "Resend OTP"}</p>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Set New Password</h2>

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button onClick={resetPassword}>
              Update Password
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;