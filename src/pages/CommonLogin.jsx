// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import "./CommonLogin.css";  
// import loginImage from "../assets/login.png"; 
//  import axios from "axios";

// import { GoogleLogin } from "@react-oauth/google";

// const CommonLogin = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     identifier: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleGoogleLogin = useGoogleLogin({
//   flow: "implicit",
//   onSuccess: async (tokenResponse) => {
//     try {
//       const userInfo = await axios.get(
//         "https://www.googleapis.com/oauth2/v3/userinfo",
//         {
//           headers: {
//             Authorization: `Bearer ${tokenResponse.access_token}`,
//           },
//         }
//       );

//       const { email, name, picture } = userInfo.data;

//       // 🔥 SAME AS ANDROID
//       const res = await api.post("/auth/google-login", {
//         token: tokenResponse.access_token,
//       });

//       const response = res.data;

//       // 🆕 NEW USER → NEED ROLE
//       if (response.data?.needRole) {
//         // 👉 you must create modal in web like mobile
//         console.log("Need role selection");
//         // store temp data and show modal
//         return;
//       }

//       // ✅ EXISTING USER
//       if (response.success) {
//         const userData = response.data;

//         localStorage.setItem("hlopgToken", userData.token);
//         localStorage.setItem("hlopgRole", userData.userType);
//         localStorage.setItem("hlopgUser", JSON.stringify(userData));

//         window.dispatchEvent(new Event("loginSuccess"));

//         navigate(
//           userData.userType === "OWNER"
//             ? "/owner-dashboard"
//             : "/"
//         );
//       }
//     } catch (err) {
//       console.log("GOOGLE LOGIN ERROR:", err);
//       setError("Google login failed");
//     }
//   },

//   onError: () => {
//     setError("Google login failed");
//   },
// });

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");
//   setLoading(true);

//   localStorage.clear();

//   // 🔹 OWNER LOGIN
//   try {
//     const ownerRes = await api.post("/auth/login/owner", formData);

//     if (ownerRes.data?.success) {
//       const owner = ownerRes.data.data;
//       const token = owner.token;

//       localStorage.setItem("hlopgToken", token);
//       localStorage.setItem("hlopgRole", "OWNER");
//       localStorage.setItem("hlopgOwner", JSON.stringify(owner));

//       window.dispatchEvent(new Event("loginSuccess"));
//       navigate("/owner-dashboard");
//       return;
//     }
//   } catch (err) {
//     console.log("Owner login failed");
//   }

//   // 🔹 USER LOGIN
//   try {
//     const userRes = await api.post("/auth/login/user", formData);

//     if (userRes.data?.success) {
//       const user = userRes.data.data;
//       const token = user.token;

//       localStorage.setItem("hlopgToken", token);
//       localStorage.setItem("hlopgRole", "USER");
//       localStorage.setItem("hlopgUser", JSON.stringify(user));

//       // ✅ CHECK SUBSCRIPTION
//       const subRes = await api.get("/auth/check-subscription", {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       localStorage.setItem("subscription", JSON.stringify(subRes.data));

//       window.dispatchEvent(new Event("loginSuccess"));

//          navigate("/");
      

//       return;
//     }

//   } catch (err) {
//     console.log("User login failed:", err);
//     setError("Invalid email / phone or password");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="login-container">
      
//       {/* LEFT IMAGE */}
//       <div className="login-left">
//         <img src={loginImage}  alt="login visual" />
//         <div className="back-link" onClick={() => navigate("/")}>
//          </div>
//       </div>

//       {/* RIGHT FORM */}
//       <div className="login-right">
//         <div className="Commonlogin-card">

//           <div className="commonlogo">
//             <img src="/logo.png" alt="logo" />
//           </div>

//           <h2>Login</h2>

//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               name="identifier"
//               placeholder="Email / Phone Number"
//               value={formData.identifier}
//               onChange={handleChange}
//               required
//             />

//             <div className="password-field">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Enter Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />

//               <span onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>

//             <div className="remember">
//               <input type="checkbox" />
//               <label>Remember me</label>
//             </div>
//           {error && <p className="error">{error}</p>}

//             <button type="submit" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <p className="signup">
//               New User ? <span onClick={() => navigate("/RoleSelection")}>Signup</span>
//             </p>

// <div className="divider">
//   <span>Or</span>
// </div>
//            <button
//   type="button"
//   className="google-btn"
//   onClick={() => handleGoogleLogin()}
// >
//   <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="g" />
//   Sign in with Google
// </button>
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommonLogin;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./CommonLogin.css";
import loginImage from "../assets/login.png";

import { GoogleLogin } from "@react-oauth/google";

const CommonLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [roleModalVisible, setRoleModalVisible] = useState(false);
const [phoneModalVisible, setPhoneModalVisible] = useState(false);

const [googleRoleData, setGoogleRoleData] = useState(null);
const [selectedRole, setSelectedRole] = useState("");
const [phone, setPhone] = useState("");
const [otpModalVisible, setOtpModalVisible] = useState(false);
const [otp, setOtp] = useState("");

const checkPhoneExists = async (phone) => {
  try {
    const res = await api.post("/auth/check-phone", { phone });
    return res.data?.data?.exists === true;
  } catch {
    return false;
  }
};


const handlePhoneSubmit = async () => {
  if (!phone || phone.length < 10) {
    alert("Enter valid phone number");
    return;
  }

  if (!selectedRole) {
    alert("Select role");
    return;
  }

  const exists = await checkPhoneExists(phone);

  if (exists) {
    alert("Mobile already registered");
    return;
  }

  const res = await api.post("/auth/google-register", {
    email: googleRoleData.email,
    name: googleRoleData.name,
    picture: googleRoleData.picture,
    role: selectedRole,
    phone: phone,
  });

  if (!res.data.success) {
    alert(res.data.message);
    return;
  }

  // ✅ OPEN OTP MODAL (instead of navigation)
  setPhoneModalVisible(false);
  setOtpModalVisible(true);
};

const handleVerifyOtp = async () => {
  try {
    const res = await api.post("/auth/verify-otp", {
      identifier: phone,
      otpCode: otp,
      purpose: "GOOGLE_REG",
    });

    if (res.data.success) {
      const userData = res.data.data;

      // ✅ store data (same as login)
      localStorage.setItem("hlopgToken", userData.token);
      localStorage.setItem("hlopgRole", userData.userType);
      localStorage.setItem("hlopgUser", JSON.stringify(userData));

      window.dispatchEvent(new Event("loginSuccess"));

      // ✅ close modals
      setOtpModalVisible(false);
      setPhoneModalVisible(false);
      setRoleModalVisible(false);

      setOtp("");
      setPhone("");
      setSelectedRole("");

      // ✅ NAVIGATION BASED ON ROLE
      if (userData.userType === "OWNER") {
        navigate("/owner-dashboard");
      } else {
        navigate("/");
      }
    }

  } catch (err) {
    console.log("OTP ERROR FULL:", err);
    setError(err.message || "OTP failed");
  }
};
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ================= GOOGLE LOGIN (FIXED) =================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      if (!idToken) {
        setError("Google token missing");
        return;
      }

      console.log("ID TOKEN:", idToken);

      // 🔥 SAME API AS ANDROID
      const res = await api.post("/auth/google-login", {
        token: idToken,
      });

      const response = res.data;

      // 🆕 NEW USER → NEED ROLE
      if (response.data?.needRole) {
  setGoogleRoleData(response.data);
  setRoleModalVisible(true);
  return;
}

      // ✅ EXISTING USER LOGIN
      if (response.success) {
        const userData = response.data;

        localStorage.setItem("hlopgToken", userData.token);
        localStorage.setItem("hlopgRole", userData.userType);
        localStorage.setItem("hlopgUser", JSON.stringify(userData));

        window.dispatchEvent(new Event("loginSuccess"));

        navigate(
          userData.userType === "OWNER"
            ? "/owner-dashboard"
            : "/"
        );
      }
    } catch (err) {
      console.log("GOOGLE LOGIN ERROR:", err);
      setError("Google login failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    localStorage.clear();

    // 🔹 OWNER LOGIN
    try {
      const ownerRes = await api.post("/auth/login/owner", formData);

      if (ownerRes.data?.success) {
        const owner = ownerRes.data.data;

        localStorage.setItem("hlopgToken", owner.token);
        localStorage.setItem("hlopgRole", "OWNER");
        localStorage.setItem("hlopgOwner", JSON.stringify(owner));

        window.dispatchEvent(new Event("loginSuccess"));
        navigate("/owner-dashboard");
        return;
      }
    } catch {
      console.log("Owner login failed");
    }

    // 🔹 USER LOGIN
    try {
      const userRes = await api.post("/auth/login/user", formData);

      if (userRes.data?.success) {
        const user = userRes.data.data;

        localStorage.setItem("hlopgToken", user.token);
        localStorage.setItem("hlopgRole", "USER");
        localStorage.setItem("hlopgUser", JSON.stringify(user));

        const subRes = await api.get("/auth/check-subscription", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        localStorage.setItem("subscription", JSON.stringify(subRes.data));

        window.dispatchEvent(new Event("loginSuccess"));
        navigate("/");
        return;
      }
    } catch (err) {
      console.log("User login failed:", err);
      setError("Invalid email / phone or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* LEFT IMAGE */}
      <div className="login-left">
        <img src={loginImage} alt="login visual" />
      </div>

      {/* RIGHT FORM */}
      <div className="login-right">
        <div className="Commonlogin-card">
          <div className="commonlogo">
            <img src="/logo.png" alt="logo" />
          </div>

          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="identifier"
              placeholder="Email / Phone Number"
              value={formData.identifier}
              onChange={handleChange}
              required
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="signup">
              New User ?{" "}
              <span onClick={() => navigate("/RoleSelection")}>
                Signup
              </span>
            </p>

            <div className="divider">
              <span>Or</span>
            </div>

            {/* ✅ GOOGLE BUTTON (FIXED) */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed")}
              />
            </div>
          </form>
        </div>
      </div>

      {roleModalVisible && (
  <div className="modal-overlay">
    <div className="modal-card">
      <h2>Select Role</h2>
      <p>Continue as</p>

      <div className="role-row">
        <button
          className="student-btn"
          onClick={() => {
            setSelectedRole("USER");
            setRoleModalVisible(false);
            setPhoneModalVisible(true);
          }}
        >
          Student
        </button>

        <button
          className="owner-btn"
          onClick={() => {
            setSelectedRole("OWNER");
            setRoleModalVisible(false);
            setPhoneModalVisible(true);
          }}
        >
          Owner
        </button>
      </div>
    </div>
  </div>
)}


{phoneModalVisible && (
  <div className="modal-overlay">
    <div className="modal-card">
      <h2>Enter Phone Number</h2>

      <input
        type="text"
        placeholder="Enter mobile number"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value.replace(/[^0-9]/g, ""))
        }
        maxLength={10}
      />

      <button onClick={handlePhoneSubmit}>
        Send OTP
      </button>

      <button
        onClick={() => {
          setPhoneModalVisible(false);
          setRoleModalVisible(false);
          setPhone("");
          setSelectedRole("");
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}


{otpModalVisible && (
  <div className="modal-overlay">
    <div className="modal-card">
      <h2>Verify OTP</h2>
      <p>Sent to +91 {phone}</p>

      <input
  type="text"
  placeholder="Enter OTP"
  value={otp}
  onChange={(e) => setOtp(e.target.value)}
/>

      <button onClick={handleVerifyOtp}>
        Verify OTP
      </button>

      <button
        onClick={() => {
          setOtpModalVisible(false);
          setPhoneModalVisible(false);
          setRoleModalVisible(false);
          setOtp("");
          setPhone("");
          setSelectedRole("");
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}



    </div>
  );
};

export default CommonLogin;