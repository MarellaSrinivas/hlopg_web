

// src/pages/AdminPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaHome,
  FaMoneyBill,
  FaHeart,
  FaCogs,
  FaUpload,
  FaList,
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaKey,
  FaFileAlt,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaEdit,
  FaLocationArrow,
  FaClosedCaptioning
} from "react-icons/fa";
import notificationSound from "../assets/notification.mp3";
import Notifications from "./Notifications";

import Dashboard from "./Dashboard";
import UploadPG from "./UploadPG";
import MyPGs from "./MyPGs";
import MyRooms from "./MyRooms";
import Members from "./Members"
import Reviews from "./Reviews";
import MyBookings from "./MyBookings";


import Logo from "../assets/logo.png";

import "./AdminPanel.css";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { connectSocket } from "../socket";

const sidebarOptions = [
  { name: "Dashboard", icon: <FaHome /> },
  { name: "Upload PG", icon: <FaUpload /> },
  { name: "My PG’s", icon: <FaList /> },
  { name: "My Rooms", icon: <FaUser /> },
    { name: "Notifications", icon: <FaBell /> },    
  { name: "My Bookings", icon: <FaFileAlt /> },    
{ name: "PG Members", icon: <FaUser /> },

  { name: "Reviews", icon: <FaHeart /> },
   { name: "Logout", icon: <FaSignOutAlt /> },
];


const PGSelection = ({ pgs = [], onSelect, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="pg-selection-loading">
        <div className="spinner"></div>
        <p>Loading your PGs...</p>
      </div>
    );
  }

  if (pgs.length === 0) {
    return (
      <div className="pg-selection-empty">
        <div className="empty-icon"><FaHome/></div>
        <h3>No PGs Found</h3>
        <p>You need to upload a PG first to manage rooms.</p>
        <button 
          className="upload-btn"
          onClick={() => navigate("/owner-dashboard?tab=Upload PG")}
        >
          Upload Your First PG
        </button>
      </div>
    );
  }



return (
    <div className="pg-selection-container">
      <h2>Select a PG to Manage Rooms</h2>
      <p>Choose from your PGs below:</p>
      
      <div className="pg-selection-grid">
        {pgs.map((pg) => (
          <div 
            key={pg.hostel_id} 
            className="pg-selection-card"
            onClick={() => onSelect(pg)}
          >
            <div className="pg-selection-image">
              <img 
                src={pg.img || "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=PG"} 
                alt={pg.hostel_name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=PG";
                }}
              />
            </div>
            <div className="pg-selection-info">
              <h3>{pg.hostel_name}</h3>
              <p><FaLocationArrow/> {pg.area}, {pg.city}</p>
              <div className="pg-selection-stats">
                <span>Rooms: {pg.total_rooms || 0}</span>
                <span>Occupied: {pg.occupied_rooms || 0}</span>
                <span>Vacant: {pg.vacant_rooms || 0}</span>
              </div>
              <button className="select-btn">
                Manage Rooms
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminPanel = () => {

  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef(null);
  
const [showSubscribePopup, setShowSubscribePopup] = useState(false);
const [checkingSubscription, setCheckingSubscription] = useState(true);


const [notifications, setNotifications] = useState([]); // FIXED
const [unreadCount, setUnreadCount] = useState(0);
 
  const [selected, setSelected] = useState("Dashboard");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const [selectedPG, setSelectedPG] = useState(null);
 const socketConnectedRef = useRef(false);

   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


   
  useEffect(() => {
  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem("hlopgToken");

      console.log("TOKEN:", token);

      const res = await api.get("/auth/check-subscription", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("SUBSCRIPTION RESPONSE:", res.data);

      if (!res.data.active) {
        console.log("Opening popup");
        setShowSubscribePopup(true);
      }

    } catch (err) {
      console.error("Subscription check failed:", err);
    } finally {
      setCheckingSubscription(false);
    }
  };

  checkSubscription();
}, []);



const activateFreeSubscription = async () => {
  try {
    const token = localStorage.getItem("hlopgToken");

    const res = await api.post(
      "/auth/activate-free-subscription",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.success) {
      alert("🎉 Free subscription activated!");
      setShowSubscribePopup(false);
    }

  } catch (err) {
    console.error(err);
    alert("Failed to activate subscription");
  }
};

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


 
  // Auth check - Keep your existing useEffect
  useEffect(() => {
    const verifyAndFetchUser = async () => {
      const token = localStorage.getItem("hlopgToken");
      
      console.log("🔍 AdminPanel - Checking localStorage with token:", token ? "Token exists" : "No token");
      
      if (!token) {
        console.log("❌ No token, redirecting to RoleSelection");
        navigate("/RoleSelection");
        return;
      }

      try {
        console.log("🔄 Fetching owner data from API...");
        const ownerRes = await api.get("/auth/ownerid", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (ownerRes.status === 200 && ownerRes.data) {
          console.log("✅ Owner data fetched:", ownerRes.data);
          
          const ownerData = {
            id: ownerRes.data.id,
            name: ownerRes.data.name,
            email: ownerRes.data.email,
            phone: ownerRes.data.phone,
            userType: ownerRes.data.userType,
            owner_id: ownerRes.data.id,
            // Add additional fields with defaults if not present
            gender: ownerRes.data.gender || "Male",
            city: ownerRes.data.city || "Hyderabad",
            profileInitial: ownerRes.data.name ? ownerRes.data.name.charAt(0).toUpperCase() : "O"
          };
          
          setUser(ownerData);
          localStorage.setItem("hlopgOwner", JSON.stringify(ownerData));
          localStorage.removeItem("hlopgUser");
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (fetchErr) {
        console.error("❌ Error fetching owner:", fetchErr);
        
        // Fallback to cached data
        const cachedOwner = localStorage.getItem("hlopgOwner");
        if (cachedOwner) {
          try {
            console.log("🔄 Using cached owner data");
            const parsedOwner = JSON.parse(cachedOwner);
            parsedOwner.profileInitial = parsedOwner.name ? parsedOwner.name.charAt(0).toUpperCase() : "O";
            setUser(parsedOwner);
          } catch (e) {
            console.error("❌ Error parsing cached owner:", e);
            localStorage.removeItem("hlopgOwner");
            navigate("/RoleSelection");
          }
        } else {
          console.log("❌ No cached data, redirecting to RoleSelection");
          navigate("/RoleSelection");
        }
      }
    };

    verifyAndFetchUser();
  }, [navigate]);
 useEffect(() => {
    const owner = localStorage.getItem("hlopgOwner");
  if (socketConnectedRef.current) return;

  socketConnectedRef.current = true;

    if (owner?.id) {
  const socket = connectSocket((notification) => {
        console.log("📩 New Booking:", notification);

        const newNotification = {
          id: Date.now(),
          studentName: notification.studentName || notification.userName,
          phone: notification.userPhone,
          pgName: notification.pgName,
          sharingType: notification.sharingType,
          time: new Date().toLocaleTimeString(),
        };

        setNotifications((prev) => [newNotification, ...prev]);

         // ✅ Increase unread count
      setUnreadCount((prev) => prev + 1);

        // 🔔 PLAY SOUND
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.log("Autoplay blocked:", err);
        });
      }
      }, owner.id);
       // ✅ Cleanup on unmount
  return () => {
 
        socket?.deactivate(); // cleanup
 
  };
    }
  }, []);

const toggleNotifications = () => {
  setIsOpen(!isOpen);

  if (!isOpen) {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  }
};

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("hlopgToken");
    localStorage.removeItem("hlopgUser");
    localStorage.removeItem("hlopgOwner");
    setShowProfileDropdown(false);
    alert("Logged out successfully!");
    navigate("/");
  };

  const handleMyRoomsClick = () => {
    // Fetch user's PGs and show selection modal
    // Or directly navigate to room management for first PG
    setSelected("My Rooms");
  };

  // When a PG is selected for room management
  const handlePGSelectForRooms = (pg) => {
    setSelectedPG(pg);
    setSelected("PG Rooms"); // Add new option
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Get user initials for profile icon
  const getUserInitials = () => {
    if (!user || !user.name) return "O";
    return user.name.charAt(0).toUpperCase();
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Profile dropdown menu items
  const dropdownMenuItems = [
     { icon: <FaKey />, text: "Change Password", onClick: () => alert("Change Password clicked") },
    { icon: <FaFileAlt />, text: "Terms And Conditions", onClick: () => alert("Terms clicked") },
  ];

 
  // Render selected component
  const renderComponent = () => {
    switch (selected) {
      case "Dashboard":
  return (
    <Dashboard
      user={user}
      notifications={notifications}
    />
  );
      case "Upload PG":
        return <UploadPG />;
      case "My PG’s":
        return <MyPGs user={user} onSelectForRooms={handlePGSelectForRooms} />;
      case "My Rooms":
         return <MyRooms user={user} />;

         case "Notifications":
  return <Notifications user={user} />;
  case "My Bookings":
  return <MyBookings user={user} />;

  case "PG Members":
  return <Members user={user} />;

      
      case "Reviews":
        return <Reviews />;
      default:
        return (
          <div className="placeholder">
            <h2>{selected}</h2>
            <p>Content coming soon...</p>
          </div>
        );
    }
  };

  return (
   <div>
<div className={`admin-panel-container ${showSubscribePopup ? "blurred" : ""}`}>
  
          {/* Sidebar - Keep your existing sidebar */}
      <aside className="admin-panel-sidebar">
        <div className="admin-panel-sidebar-top">
          <div
            className="logo-container"
            style={{ cursor: "pointer" }}
           >
            {/* <h2 className="logo">
              <img src={Logo} alt="HloPG Logo" />
            </h2> */}
                {/* <div className="admin-sidebar-logo">
               <img  src={Logo} alt="HloPG Logo"  />
               </div> */}
               <h2 className="admin-h2logo">Hlopg</h2>
           </div>

          

          <ul className="admin-panel-sidebar-menu">
            {sidebarOptions.map((item) => (
              <li
                key={item.name}
                className={`admin-panel-menu-item ${selected === item.name ? "active" : ""}`}
                onClick={() => {
        if (item.name === "Logout") {
          setShowLogoutConfirm(true); // Show logout confirmation
        } else {
          setSelected(item.name);
        }
      }}
    >
              
                <span className="admin-panel-icon">{item.icon}</span>
                <span className="admin-panel-label">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        
        
      </aside>

      {/* Main Content with Header */}
      <main className="admin-panel-main-content">
        {/* Header with Profile Icon */}
        <header className="admin-panel-header">
          <div className="admin-panel-header-left">
            <h1>{getGreeting()}, {user?.name || "Owner"}!</h1>
            <p>Welcome to your HloPG Dashboard</p>
          </div>


          {/* <div className="notification-wrapper">
  <div className="bell-icon" onClick={toggleNotifications}>
    <FaBell size={20} />
    {unreadCount > 0 && (
      <span className="badge">{unreadCount}</span>
    )}
  </div> */}
{/* 
  {isOpen && (
    <div className="notification-dropdown">
      <h4>Admin Notifications</h4>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${
              notification.read ? "read" : "unread"
            }`}
          >
            <p><strong>{notification.studentName} booked { notification.pgName} Hostel</strong></p>
            <p>📞{notification.phone}</p>
            <small>{notification.time}</small>
          </div>
        ))
      )}
    </div>
  )}
</div> */}

          {/* Profile Section */}
          {/* Profile Section - AdminPanel.jsx */}
<div className="admin-panel-profile-section" ref={dropdownRef}>
  <button 
    className="admin-panel-profile-icon-btn" 
    onClick={() => navigate("/owner-profile")}  
    aria-label="Profile menu"
  >
    <div className="admin-panel-profile-icons">
      {getUserInitials()}
    </div>
  </button>
</div>
    
  </header>


        {/* Main Content Body */}
        <div className="admin-panel-content-body">
          {renderComponent()}
        </div>
      </main>
       {/* Add this logout confirmation modal */}
      {showLogoutConfirm && (
  <div className="logout-confirmation-modal">
    <div className="logout-confirmation-content">
      {/* Close Button - Top Right */}
      <button 
        className="modal-close-btn"
        onClick={() => setShowLogoutConfirm(false)}
        aria-label="Close"
      >
        ×
      </button>
      
      <h3>Are you sure you want to logout?</h3>
      {/* <p>You will be redirected to the homepage.</p> */}
      <div className="logout-confirmation-buttons">
        <button 
          className="logout-confirm-cancel"
          onClick={() => setShowLogoutConfirm(false)}
        >
          Cancel
        </button>
        <button 
          className="logout-confirm-logout"
          onClick={() => {
            localStorage.removeItem("hlopgToken");
            localStorage.removeItem("hlopgUser");
            localStorage.removeItem("hlopgOwner");
            localStorage.removeItem("hlopgRole");
            setShowLogoutConfirm(false);
            navigate("/login");
          }}
        >
          Yes, Logout
        </button>
      </div>
    </div>
  </div>
)}



  {/* 🔔 Notification Sound */}
      <audio ref={audioRef} src={notificationSound} preload="auto" />

    </div>


{showSubscribePopup && (
  <div className="subscribe-overlay">
    <div className="subscribe-card">

      <button
        className="popup-close"
        onClick={() => setShowSubscribePopup(false)}
      >
        ×
      </button>

      <h2>Activate Free Subscription</h2>

      <p>
        Start managing your PGs and receive bookings by activating your
        <strong> free subscription</strong>.
      </p>

      <button
        className="subscribe-btn"
        onClick={activateFreeSubscription}
      >
        Activate Free Subscription
      </button>

    </div>
  </div>
)}

 </div>
    
  );
};
    

export default AdminPanel;
