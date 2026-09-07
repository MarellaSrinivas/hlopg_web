import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { HiOutlineUserCircle } from "react-icons/hi2";
import "./Header.css";
import logo from "../assets/logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const cities = [
    { name: "Hyderabad", path: "/hyderabad" },
    { name: "Chennai", path: "/chennai" },
    { name: "Bangalore", path: "/bangalore" },
    { name: "Mumbai", path: "/mumbai" },
  ];

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
  const handleClickOutside = () => setProfileOpen(false);
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);


  // Login Check
  useEffect(() => {
  const checkLogin = () => {
    const token = localStorage.getItem("hlopgToken");
    const role = localStorage.getItem("hlopgRole");
    setIsLoggedIn(!!(token && role));
  };


  // 🔥 Listen to login event (same tab)
  window.addEventListener("loginSuccess", checkLogin);

    checkLogin();


  return () => {
    window.removeEventListener("loginSuccess", checkLogin);
  };
}, []);
  // Search Input Change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchCity(value);

    if (value.trim()) {
      const matchedCities = cities
        .map((c) => c.name)
        .filter((city) => city.toLowerCase().includes(value.toLowerCase()));

      setSuggestions(matchedCities);
    } else {
      setSuggestions([]);
    }
  };


  // Search Button Click
  const handleSearch = () => {
    if (!searchCity.trim()) {
      alert("Please enter a city name.");
      return;
    }

    const cityName = searchCity.trim().toLowerCase();
    const matchedCity = cities.find(
      (c) => c.name.toLowerCase() === cityName
    );

    if (matchedCity) {
      navigate(`/city/${cityName}`);
    } else {
      alert("City not found. Please select from Hyderabad, Chennai, Bangalore, Mumbai.");
    }

    setSuggestions([]);
  };

  // Enter Key Search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Suggestion Click
  const handleSuggestionClick = (cityName) => {
    setSearchCity(cityName);
    setSuggestions([]);
    navigate(`/city/${cityName.toLowerCase()}`);
  };

  // Signup
  const handleRoleSelection = () => {
    navigate("/RoleSelection");
    setMenuOpen(false);
  };

  // Login
  const handleLoginNavigation = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  // Profile Navigation
  const handleProfileNavigation = () => {
    const role = localStorage.getItem("hlopgRole");

    if (role === "OWNER") navigate("/owner-dashboard");
    else if (role === "USER") navigate("/user-dashboard");
    else navigate("/login");

    setMenuOpen(false);
  };

  // Close Mobile Menu
  const handleCloseMenu = () => {
    setMenuOpen(false);
  };


  const handleLogout = () => {
 
    localStorage.removeItem("hlopgToken");
    localStorage.removeItem("hlopgUser");
    localStorage.removeItem("hlopgOwner");

    navigate("/login");
   };

  return (
    <header
      className={`header ${scrolled ? "scrolled" : ""} ${
        location.pathname === "/" ? "home-animation" : ""
      }`}
    >
      {/* Logo */}
      <div className="brand" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Desktop Search */}
      {/* <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search City"
            className="search-input"
            value={searchCity}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((city, index) => (
                <li key={index} onClick={() => handleSuggestionClick(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div> */}

      {/* Desktop Navigation */}
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/about">About Us</Link>
          </li>

          <li>
            <Link to="/contact">Contact</Link>
          </li>

          {/* Auth Section */}
          <li className="auth-section">
            {!isLoggedIn ? (
              <div className="auth-buttons">
                <button className="login-btn" onClick={handleLoginNavigation}>
                  Login
                </button>

                <button className="signup-btn" onClick={handleRoleSelection}>
                  Signup
                </button>
              </div>
            ) : (
              <div
                className="profile-icon-container"
                onClick={handleProfileNavigation}
              >
                <HiOutlineUserCircle className="profile-icon" />
              </div>
            )}
          </li>
        </ul>
      </nav>

      <div className="mobile-right-icons">
  {isLoggedIn && (
  <div className="mobile-profile-icon-top">
<div
  className="mobile-profile-icon-top"
  onClick={(e) => {
    e.stopPropagation();
    setProfileOpen(!profileOpen);
  }}
>
  <HiOutlineUserCircle />
</div>
</div>
  )}

  <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
    {menuOpen ? <FaTimes /> : <FaBars />}
  </div>
</div>

      {/* Mobile Hamburger */}
    

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={handleCloseMenu}
      ></div>

      {/* Mobile Navigation Container */}
      <div className={`mobile-nav-container ${menuOpen ? "open" : ""}`}>
        {/* Close Button */}
        {/* <button className="mobile-close-btn" onClick={handleCloseMenu}>
          <FaTimes />
        </button> */}

        {/* Mobile Search */}
        <div className="mobile-search-container">
          <div className="mobile-search-box">
            <FaSearch className="mobile-search-icon" />
            <input
              type="text"
              placeholder="Search City"
              className="mobile-search-input"
              value={searchCity}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((city, index) => (
                <li key={index} onClick={() => handleSuggestionClick(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile Nav Items */}
        <ul className="mobile-nav-items">
          <li>
            <Link to="/" onClick={handleCloseMenu}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/about" onClick={handleCloseMenu}>
              About Us
            </Link>
          </li>

          <li>
            <Link to="/contact" onClick={handleCloseMenu}>
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Auth Section */}
        <div className="mobile-auth-section">
          {!isLoggedIn ? (
            <>
              <button
                className="mobile-login-btn"
                onClick={handleLoginNavigation}
              >
                Login
              </button>

              <button
                className="mobile-signup-btn"
                onClick={handleRoleSelection}
              >
                Signup
              </button>
            </>
          ) : (
            <div
              className="mobile-profile-section"
              onClick={handleProfileNavigation}
            >
              <div className="mobile-profile-icon">
                <HiOutlineUserCircle size={30} />
              </div>

              <div className="mobile-profile-info">
                <h4>My Profile</h4>
              </div>
            </div>
          )}
        </div>

      </div>

      
        {profileOpen && (
  <div className="mobile-profile-dropdown">
    <p onClick={() => navigate("/user-dashboard", { state: { openSection: "basic-info" } })}>Basic Information</p>
    <p onClick={() => navigate("/user-dashboard", { state: { openSection: "liked-pg" } })}>Liked PG’s List</p>
    <p onClick={() => navigate("/user-dashboard", { state: { openSection: "payment-history" } })}>Payment History</p>
    <p onClick={() => navigate("/user-dashboard", { state: { openSection: "my-bookings" } })}>My Bookings</p>
    <p onClick={() => navigate("/user-dashboard", { state: { openSection: "notifications" } })}>Notifications</p>
    <p onClick={() => navigate("/user-dashboard", { state: { openSection: "complaints" } })}>Complaints</p>
    <p onClick={() => navigate("/user-dashboard", { state: { openSection: "change-password" } })}>Change Password</p>
        <p onClick={() => navigate("/user-dashboard", { state: { openSection: "delete-account" } })}>Delete Account</p>

    <p onClick={() => navigate("/user-dashboard", { state: { openSection: "terms" } })}>Terms & Conditions</p>
<p onClick={handleLogout}>Logout</p>
  </div>
)}
    </header>
  );
};

export default Header;