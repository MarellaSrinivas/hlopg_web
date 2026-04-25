import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
 import { Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import IntroVideo from "./components/IntroVideo";
import LoadingVideo from "./components/LoadingVideo";
 import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import HostelPage from "./pages/HostelPage";
import Members  from "./pages/Members";
import VerifyOTP from "./pages/VerifyOTP";

import RoleSelection from "./components/RoleSelection";
import StudentLogin from "./components/StudentLogin";
import StudentSignup from "./components/StudentSignup";
import StudentForgetPassword from "./components/StudentForgetPassword";
import OwnerLogin from "./components/OwnerLogin";
import OwnerSignup from "./components/OwnerSignup";
import OwnerForgetPassword from "./components/OwnerForgetPassword";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import UploadPG from "./pages/UploadPG";
import MyPGs from "./pages/MyPGs";
import EditPG from "./pages/EditPG";
 import CityHostels from "./pages/cities/CityHostels";
import UserProfile from "./pages/UserPanel";
import Contact from "./pages/Contact";
import ProfilePage from "./pages/ProfilePage";
import CommonLogin from "./pages/CommonLogin";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import BookingPage from "./pages/BookingPage"


import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOwners from "./pages/admin/AdminOwners"



 
function App() {
  const location = useLocation();
  const navigate = useNavigate();
 const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(() => {
  const token = localStorage.getItem("hlopgToken");
  const role = localStorage.getItem("hlopgRole");
  return !!(token && role === "OWNER");
});

  const [showIntro, setShowIntro] = useState(false);
  const [loading, setLoading] = useState(false);
 
 useEffect(() => {
  const checkAuth = () => {
    const token = localStorage.getItem("hlopgToken");
    const role = localStorage.getItem("hlopgRole");

    const ownerLoggedIn = !!(token && role === "OWNER");
    setIsOwnerLoggedIn(ownerLoggedIn);
  };

  checkAuth();

  // 🔥 Listen for login event (same tab)
  window.addEventListener("loginSuccess", checkAuth);
    window.addEventListener("storage", checkAuth); // cross-tab logout support


  return () => {
    window.removeEventListener("loginSuccess", checkAuth);
        window.removeEventListener("storage", checkAuth);

  };
}, []);
 
  /* ---------------- INTRO VIDEO (ONLY ONCE EVER) ---------------- */
useEffect(() => {
  const token = localStorage.getItem("hlopgToken");
  const role = localStorage.getItem("hlopgRole");
  const seenIntro = localStorage.getItem("seenIntro");

  // 🔥 If owner is logged in → NEVER show intro
  if (token && role === "OWNER") {
    setShowIntro(false);
    return;
  }

  if (!seenIntro) {
    setShowIntro(true);
  } else {
    setShowIntro(false);
  }
}, []);
 
  const handleIntroFinish = () => {
    localStorage.setItem("seenIntro", "true");
    setShowIntro(false);
  };
 
  /* ---------------- LOADING VIDEO (ONCE PER SESSION) ---------------- */
  useEffect(() => {
    if (isOwnerLoggedIn || showIntro) return;
 
    const hasLoadedOnce = sessionStorage.getItem("hasLoadedOnce");
    if (hasLoadedOnce) return;
 
    setLoading(true);
 
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("hasLoadedOnce", "true");
    }, 1500);
 
    return () => clearTimeout(timer);
  }, [location.pathname, showIntro, isOwnerLoggedIn]);
 
  /* ---------------- HEADER / FOOTER VISIBILITY ---------------- */
 const hideHeaderFooter =
  location.pathname.startsWith("/owner-dashboard") ||
  location.pathname.startsWith("/view") ||
  location.pathname.startsWith("/admin") ||
  // location.pathname.startsWith("/booking") ||
  location.pathname === "/owner-profile" ||
  location.pathname === "/admin-login" ||
   location.pathname === "/admin/dashboard";
  return (
    <div className="app-container">
                     <ScrollToTop />

      {/* Intro Video */}
      {showIntro && !isOwnerLoggedIn && (
        <IntroVideo onFinish={handleIntroFinish} />
      )}
 
      {/* Loading Video */}
      {!showIntro && loading && !isOwnerLoggedIn && <LoadingVideo />}
 
      {/* Header */}
      {!hideHeaderFooter && !showIntro && !loading && <Header />}
 
      <main className="content">
 
{(!showIntro || isOwnerLoggedIn) && (

          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/hostel/:hostelId" element={<HostelPage />} />
            <Route path="/RoleSelection" element={<RoleSelection />} />
            <Route path="/city/:cityName" element={<CityHostels />} />
            <Route path="/StudentLogin" element={<StudentLogin />} />
            <Route path="/student-signup" element={<StudentSignup />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route
              path="/student-forgot-password"
              element={<StudentForgetPassword />}
            />
            <Route path="/ownerLogin" element={<OwnerLogin />} />
            <Route path="/ownersignup" element={<OwnerSignup />} />
            <Route
              path="/owner-forgot-password"
              element={<OwnerForgetPassword />}
            />
            <Route path="/login" element={<CommonLogin />} />
            <Route path="/user-dashboard" element={<UserProfile />} />
            <Route path="/booking/:hostelId" element={<BookingPage />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />



            <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<AdminUsers />} />
    <Route path="owners" element={<AdminOwners />} />

</Route>



 
            {/* Owner Dashboard */}
           <Route
  path="/owner-dashboard"
  element={
    isOwnerLoggedIn ? (
      <AdminPanel />
    ) : (
      <Navigate to="/ownerLogin" replace />
    )
  }
/>
 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload-pg" element={<UploadPG />} />
            <Route path="/my-pgs" element={<MyPGs />} />
            <Route path="/edit-pg/:hostel_id" element={<EditPG />} />
             <Route path="/owner-profile" element={<ProfilePage />} />
                        <Route path="/members" element={<Members />} />

          </Routes>
        )}
      </main>
      {/* Footer */}
      {!hideHeaderFooter && !showIntro && !loading && <Footer />}
    </div>
  );
}
 
export default App;
