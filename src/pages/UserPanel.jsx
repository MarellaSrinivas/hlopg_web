import React, { useState, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import "./UserPanel.css";
import {
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaHeart,
} from "react-icons/fa";
import api from "../api";
import defaultPGImg from "../assets/pg1.jpg";

 

const UserPanel = ({ onSave, onLogout }) => {
    const location = useLocation();  
    const [showMemberConfirmModal, setShowMemberConfirmModal] = useState(false);
const [selectedNotification, setSelectedNotification] = useState(null);
 const [activeSection, setActiveSection] = useState(
  location.state?.openSection || "basic-info"
);  const [user, setUser] = useState({});
  const [draftUser, setDraftUser] = useState({});
  const [message, setMessage] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [animateusersidebar, setAnimateusersidebar] = useState(false);
  const [animateGreeting, setAnimateGreeting] = useState(false);
const [stays, setStays] = useState([]);
const [loadingStays, setLoadingStays] = useState(false);
  const [bookings, setBookings] = useState([]);
const [loadingBookings, setLoadingBookings] = useState(false);
const [showVacateModal, setShowVacateModal] = useState(false);
const [selectedStayId, setSelectedStayId] = useState(null);
const [vacateDate, setVacateDate] = useState("");
const [vacateReason, setVacateReason] = useState("");
const [complaints, setComplaints] = useState([]);
const [loadingComplaints, setLoadingComplaints] = useState(false);
const [reviews, setReviews] = useState({});
const [showReviewModal, setShowReviewModal] = useState(false);
 const [rating, setRating] = useState(0);
const [reviewText, setReviewText] = useState("");
const [comment, setComment] = useState("");
const [showComplaintModal, setShowComplaintModal] = useState(false);
const [complaintText, setComplaintText] = useState("");

const [pgUpdates, setPgUpdates] = useState([]);
const [loadingUpdates, setLoadingUpdates] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const openComplaintModal = (hostelId) => {
  setSelectedHostelId(hostelId);
  setShowComplaintModal(true);
};

const closeComplaintModal = () => {
  setShowComplaintModal(false);
  setComplaintText("");
};


const [ratings, setRatings] = useState({});
   const [loading, setLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    letter: false,
    number: false,
    symbol: false,
  });

  const [unreadCount, setUnreadCount] = useState(0);   
  const [notifications, setNotifications] = useState([]);
const [loadingNotifications, setLoadingNotifications] = useState(false);


  const [selectedHostelId, setSelectedHostelId] = useState(null);

const openReviewModal = (hostelId) => {
  if (!hostelId) {
    console.error("Hostel ID is missing!");
    return;
  }

  console.log("Opening review modal for hostel:", hostelId);

  setSelectedHostelId(Number(hostelId));
  setShowReviewModal(true);
};

const closeReviewModal = () => {
  setShowReviewModal(false);
  setSelectedStayId(null);
  setRating(0);
setComment("");
};
  const [confirmValid, setConfirmValid] = useState(true);
const currentStay = stays.find((s) => {
  if (!s.vacateDate) return true;

  const today = new Date().toISOString().split("T")[0];
  return s.vacateDate >= today;
});
  const [likedHostels, setLikedHostels] = useState([]);
  const [loadingLiked, setLoadingLiked] = useState(false);

  const navigate = useNavigate();

  // ✅ BACKEND URL (CHANGE IF NEEDED)
  const BACKEND_URL = "https://api.hlopg.com";

  // ✅ FIX IMAGE URL FUNCTION (IMPORTANT)
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";

    if (imagePath.startsWith("http")) return imagePath;

    if (imagePath.startsWith("/uploads")) return `${BACKEND_URL}${imagePath}`;

    return `${BACKEND_URL}/uploads/${imagePath}`;
  };

  useEffect(() => {
  const fetchStays = async () => {
    const token = localStorage.getItem("hlopgToken");
    if (!token) return;

    try {
      setLoadingStays(true);

      const res = await api.get("/members/user-stays", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setStays(res.data.stays);
      } else {
        setStays([]);
      }
    } catch (err) {
      setStays([]);
    } finally {
      setLoadingStays(false);
    }
  };

  if (activeSection === "my-bookings") {
    fetchStays();
  }
}, [activeSection]);


const fetchPgUpdates = async (hostelId) => {
  const token = localStorage.getItem("hlopgToken");
  if (!token || !hostelId) return;

  try {
    setLoadingUpdates(true);

    const res = await api.get(`/updates/hostel/${hostelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      setPgUpdates(res.data.updates);
    } else {
      setPgUpdates([]);
    }

  } catch (err) {
    console.error("Failed to fetch updates:", err);
    setPgUpdates([]);
  } finally {
    setLoadingUpdates(false);
  }
};

useEffect(() => {
  if (activeSection === "my-bookings" && stays.length > 0) {
    const currentStay = stays.find(s => {
      if (!s.vacateDate) return true;

      const today = new Date().toISOString().split("T")[0];
      return s.vacateDate >= today;
    });

    if (currentStay) {
      fetchPgUpdates(currentStay.hostelId);
    }
  }
}, [activeSection, stays]);

 
  
useEffect(() => {
  const fetchNotifications = async () => {
    const token = localStorage.getItem("hlopgToken");
    if (!token) return;

    try {
      setLoadingNotifications(true);

      const res = await api.get("/user/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Notifications API Response:", res.data);

      if (res.data && res.data.success) {
        const list = res.data.notifications || res.data.data || [];
        setNotifications(list);

        // unread count
        const unread = list.filter((n) => !n.read).length;
        setUnreadCount(unread);

        // member added popup
        const memberAddedNotif = list.find(
          (n) => n.type === "member_added" && !n.read
        );

        if (memberAddedNotif) {
          setSelectedNotification(memberAddedNotif);
          setShowMemberConfirmModal(true);
        }

      } else {
        setNotifications([]);
      }

    } catch (err) {
      console.error("❌ Notification fetch failed:", err);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  fetchNotifications();
}, []);



  useEffect(() => {
  if (location.state?.openSection) {
    setActiveSection(location.state.openSection);

    // clear state so refresh won't reopen bookings again
    window.history.replaceState({}, document.title);
  }
}, [location.state]);


const handleMemberConfirmationFromList = async (notificationId, isStaying) => {
  const token = localStorage.getItem("hlopgToken");
  if (!token) return;

  try {
    await api.put(
      "/members/confirm-stay",
      {
        notificationId: notificationId,
        isStaying: isStaying,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    await markAsRead(notificationId);

    // Optional: refresh notifications
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );

  } catch (error) {
    console.error("Confirmation failed:", error);
  }
};
const openVacateModal = (stayId) => {
  setSelectedStayId(stayId);
  setShowVacateModal(true);
};

const closeVacateModal = () => {
  setShowVacateModal(false);
  setSelectedStayId(null);
  setVacateDate("");
  setVacateReason("");
};
const fetchMyReviews = async () => {
  try {
    const token = localStorage.getItem("hlopgToken");
    if (!token) return;

    const res = await api.get("/reviews/my-reviews", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const reviewMap = {};

    if (res.data.success) {
      // Reviews returned from backend
      res.data.reviews.forEach((r) => {
        reviewMap[r.hostelId] = {
          rating: r.rating,
          comment: r.comment
        };
      });
    }

    // ⭐ Add NULL for hostels with no review
    stays.forEach((stay) => {
      if (!reviewMap.hasOwnProperty(stay.hostelId)) {
        reviewMap[stay.hostelId] = null;
      }
    });

    setReviews(reviewMap);

  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }
};

useEffect(() => {
  if (stays.length > 0) {
    fetchMyReviews();
  }
}, [stays]);
const handleMemberConfirmation = async (isStaying) => {
  const token = localStorage.getItem("hlopgToken");
  if (!token || !selectedNotification) return;

  try {
    await api.put(
      "/members/confirm-stay",
      {
        notificationId: selectedNotification.id,
        isStaying: isStaying,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Mark notification as read
    await markAsRead(selectedNotification.id);

    setShowMemberConfirmModal(false);
    setSelectedNotification(null);

  } catch (error) {
    console.error("Confirmation failed:", error);
  }
};
const submitVacateRequest = async () => {
  if (!vacateDate) {
    alert("Please select vacate date");
    return;
  }

  try {
    const token = localStorage.getItem("hlopgToken");

  await api.put(
  `/members/request-vacate/${selectedStayId}`,
  null,
  {
    params: { vacateDate },
    headers: { Authorization: `Bearer ${token}` },
  }
);
       

    alert("Vacate request submitted successfully!");
    closeVacateModal();

  } catch (error) {
    console.error("Vacate request failed:", error);
  }
};
    // ✅ FETCH USER DETAILS
  useEffect(() => {
    const verifyAndFetchUser = async () => {
      const token = localStorage.getItem("hlopgToken");
      const owner = localStorage.getItem("hlopgOwner");
      const userStr = localStorage.getItem("hlopgUser");

      if (!token) {
        navigate("/RoleSelection");
        return;
      }

      if (owner) {
        navigate("/owner-dashboard");
        return;
      }

      // ✅ LOAD USER FROM LOCALSTORAGE
      if (userStr && userStr !== "undefined" && userStr !== "null") {
        try {
          const parsed = JSON.parse(userStr);

          // sometimes you stored wrong object in localstorage
          const userData = parsed.data ? parsed.data : parsed;

          if (userData.profileImage) {
            userData.profileImage = getFullImageUrl(userData.profileImage);
          }

          setUser(userData);
          setDraftUser(userData);
          return;
        } catch (e) {
          console.error("❌ Error parsing user:", e);
        }
      }

      // ✅ FETCH USER FROM BACKEND
      try {
        const userRes = await api.get("/auth/userid", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.status === 200) {
          const userData = userRes.data.data || userRes.data;

          if (userData.profileImage) {
            userData.profileImage = getFullImageUrl(userData.profileImage);
          }

          setUser(userData);
          setDraftUser(userData);

          // ✅ STORE CORRECT DATA
          localStorage.setItem("hlopgUser", JSON.stringify(userData));
        }
      } catch (err) {
        console.log("⚠️ User fetch failed:", err.message);

        const fallbackUser = {
          name: "User",
          email: "user@example.com",
          phone: "",
          gender: "",
        };

        setUser(fallbackUser);
        setDraftUser(fallbackUser);
      }
    };

    verifyAndFetchUser();
  }, [navigate]);

useEffect(() => {
  const fetchBookings = async () => {
    const token = localStorage.getItem("hlopgToken");
    if (!token) return;

    try {
      setLoadingBookings(true);

      const res = await api.get("/booking/user-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && Array.isArray(res.data.bookings)) {
        setBookings(res.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  if (activeSection === "my-bookings") {
    fetchBookings();
  }
}, [activeSection]);

  // ✅ FETCH LIKED HOSTELS
  useEffect(() => {
    const fetchLikedHostels = async () => {
      const token = localStorage.getItem("hlopgToken");
      if (!token) return;

      try {
        setLoadingLiked(true);

        const res = await api.get("/hostel/liked-hostels", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && Array.isArray(res.data.data)) {
          const processed = res.data.data.map((hostel) => {
            let displayImage = defaultPGImg;

            if (hostel.img) displayImage = getFullImageUrl(hostel.img);
            else if (hostel.images?.length > 0) displayImage = getFullImageUrl(hostel.images[0]);

            return {
              ...hostel,
              id: hostel.hostel_id || hostel.id,
              name: hostel.hostel_name || hostel.name || "Unnamed Hostel",
              location: hostel.area || hostel.city || hostel.address || "Unknown Location",
              rating: hostel.rating || "N/A",
              price: hostel.price || hostel.rent || "N/A",
              pg_type: hostel.pg_type || "Hostel",
              displayImage,
            };
          });

          setLikedHostels(processed);
        } else {
          setLikedHostels([]);
        }
      } catch (err) {
        console.error("❌ Error fetching liked hostels:", err);
        setLikedHostels([]);
      } finally {
        setLoadingLiked(false);
      }
    };

    if (activeSection === "liked-pg") {
      fetchLikedHostels();
    }
  }, [activeSection]);

  // ✅ PROFILE IMAGE UPLOAD FIXED
  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("hlopgToken");

    // preview image immediately
    const previewUrl = URL.createObjectURL(file);
    setDraftUser((prev) => ({ ...prev, profileImage: previewUrl }));
    setUser((prev) => ({ ...prev, profileImage: previewUrl }));

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await api.post("/auth/update-profile-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const updatedUser = res.data.data;

        const finalImageUrl = getFullImageUrl(updatedUser.profileImage);

        const mergedUser = {
          ...user,
          ...updatedUser,
          profileImage: finalImageUrl,
        };

        setUser(mergedUser);
        setDraftUser(mergedUser);

        // ✅ SAVE CORRECT USER OBJECT
        localStorage.setItem("hlopgUser", JSON.stringify(mergedUser));

        setMessage("✅ Profile image updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setMessage("❌ Upload failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const submitComplaint = async () => {
  try {
    const token = localStorage.getItem("hlopgToken");

    if (!complaintText.trim()) {
      alert("Complaint cannot be empty");
      return;
    }

    await api.post(
      "/complaints/add",
      {
        hostel_id: selectedHostelId,
        complaint: complaintText
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert("Complaint submitted successfully");
    closeComplaintModal();
    fetchMyComplaints();

  } catch (error) {
    console.error("Complaint failed:", error);
  }
};
const fetchMyComplaints = async () => {
  const token = localStorage.getItem("hlopgToken");
  if (!token) return;

  try {
    setLoadingComplaints(true);

    const res = await api.get("/complaints/my-complaints", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data.success) {
setComplaints(res.data.complaints);
    } else {
      setComplaints([]);
    }

  } catch (error) {
    console.error("Failed to fetch complaints:", error);
    setComplaints([]);
  } finally {
    setLoadingComplaints(false);
  }
};

useEffect(() => {
  if (activeSection === "complaints") {
    fetchMyComplaints();
  }
}, [activeSection]);
  const handleInputChange = (field, value) => {
    setDraftUser({ ...draftUser, [field]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("hlopgToken");

      const payload = {
        name: draftUser.name,
        gender: draftUser.gender,
      };

      const res = await api.put("/auth/update-basic-info", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const updatedUser = res.data.data;

        if (updatedUser.profileImage) {
          updatedUser.profileImage = getFullImageUrl(updatedUser.profileImage);
        }

        setUser(updatedUser);
        setDraftUser(updatedUser);

        localStorage.setItem("hlopgUser", JSON.stringify(updatedUser));

        setAnimateusersidebar(true);
        setAnimateGreeting(true);

        if (onSave) onSave(updatedUser);

        setMessage("✅ Changes saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to update user info:", error);
      setMessage("❌ Failed to save changes");
      setTimeout(() => setMessage(""), 3000);
    }
  };
const submitReview = async () => {
  try {
    const token = localStorage.getItem("hlopgToken");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!selectedHostelId || selectedHostelId === 0) {
  alert("Hostel ID missing");
  return;
}

    if (rating === 0) {
      alert("Please select rating");
      return;
    }

    console.log("HostelId:", selectedHostelId);
console.log("Rating:", rating);
console.log("Comment:", comment);

    const payload = {
      hostel_id: Number(selectedHostelId),
      rating: Number(rating),
      comment: comment || ""
    };

    console.log(selectedHostelId, rating, comment);

    console.log("Sending Review Payload:", payload);

    const res = await api.post("/reviews/add", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Review response:", res.data);

    alert("Review submitted successfully");

setReviews(prev => ({
  ...prev,
  [selectedHostelId]: {
    rating: rating,
    comment: comment
  }
}));

setShowReviewModal(false);
setRating(0);
setComment("");

  } catch (error) {
    console.error("Review submit failed:", error.response?.data || error);
  }
};


  useEffect(() => {
    if (animateusersidebar) {
      const timer = setTimeout(() => setAnimateusersidebar(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animateusersidebar]);

  useEffect(() => {
    if (animateGreeting) {
      const timer = setTimeout(() => setAnimateGreeting(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animateGreeting]);

  const openLogoutModal = () => {
    setShowLogoutModal(true);
    setModalClosing(false);
  };

  const closeLogoutModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowLogoutModal(false);
      setModalClosing(false);
    }, 300);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();

    localStorage.removeItem("hlopgToken");
    localStorage.removeItem("hlopgUser");
    localStorage.removeItem("hlopgOwner");
    localStorage.removeItem("hlopgRole");

    navigate("/login");
    closeLogoutModal();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) closeLogoutModal();
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "new") {
        setPasswordRules({
          length: value.length >= 6,
          letter: /[a-zA-Z]/.test(value),
          number: /\d/.test(value),
          symbol: /[^a-zA-Z0-9]/.test(value),
        });

        setConfirmValid(updated.confirm === "" || value === updated.confirm);
      }

      if (field === "confirm") {
        setConfirmValid(value === updated.new);
      }

      return updated;
    });
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordMsg("All fields are required");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setPasswordMsg("");

      const token = localStorage.getItem("hlopgToken");

      const res = await api.put(
        "/auth/change-password",
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswordMsg(res.data.message || "Password updated successfully");

      setTimeout(() => {
        setPasswords({ current: "", new: "", confirm: "" });
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
      }, 500);
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "basic-info":
        return (
          <>
            <h3>USER INFORMATION</h3>
            <div className="info-section">
              <div className="profile">
                <div className="profile-image">
                  <img
                    src={draftUser.profileImage || user.profileImage || "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"}
                    alt="Profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
                    }}
                  />
                </div>

                <label htmlFor="profileUpload" className="change-btn">
                  Change
                </label>

                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  onChange={handleProfileChange}
                  hidden
                />
              </div>

              <div className="info-form">
                {[
                  { label: "Name", field: "name", type: "text", editable: true },
                  { label: "Email", field: "email", type: "email", editable: false },
                  { label: "Mobile Number", field: "phone", type: "text", editable: false },
                  { label: "Gender", field: "gender", type: "text", editable: true },
                ].map((f, idx) => (
                  <div className="form-group" key={idx}>
                    <label>{f.label}</label>
                    <input
                      type={f.type}
                      value={draftUser[f.field] || ""}
                      disabled={!f.editable}
                      className={!f.editable ? "readonly" : ""}
                      onChange={(e) =>
                        f.editable && handleInputChange(f.field, e.target.value)
                      }
                    />
                  </div>
                ))}

                <button className="save-btn" onClick={handleSaveChanges}>
                  Save Changes
                </button>

                {message && <p className="save-message">{message}</p>}
              </div>
            </div>
          </>
        );

      case "liked-pg":
        return (
          <>
            <h3>LIKED PG'S LIST</h3>

            {loadingLiked ? (
              <div className="loading-container">
                <p>Loading your liked hostels...</p>
              </div>
            ) : likedHostels.length > 0 ? (
              <div className="liked-pg-container">
                {likedHostels.map((hostel) => (
                  <div
                    className="liked-pg-card"
                    key={hostel.id}
                    onClick={() => navigate(`/hostel/${hostel.id}`)}
                  >
                    <div className="liked-pg-img-container">
                      <img
                        src={hostel.displayImage}
                        alt={hostel.name}
                        className="liked-pg-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultPGImg;
                        }}
                      />

                      <div className="liked-heart-btn liked-active">
                        <FaHeart />
                      </div>
                    </div>

                    <div className="liked-pg-info">
                      <h4>{hostel.name}</h4>
                      <p className="liked-location">{hostel.location}</p>

                      <div className="liked-row">
                        <FaStar className="liked-star" />
                        <span>{hostel.rating}</span>
                        <span>•</span>
                        <span>{hostel.pg_type}</span>
                      </div>

                      <p className="liked-price">₹{hostel.price} / month</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-liked-hostels">
                <p>You haven't liked any hostels yet.</p>
                <p className="small-text">
                  Like hostels by clicking the ❤️ icon on hostel cards.
                </p>
                <button className="browse-hostels-btn" onClick={() => navigate("/")}>
                  Browse Hostels
                </button>
              </div>
            )}
          </>
        );

      case "payment-history":
        return (
          <>
            <h3>PAYMENT HISTORY</h3>
            <p>No payments yet.</p>
          </>
        );


     case "my-bookings":
  return (
    <>
      <h3>MY BOOKINGS</h3>

      <hr />
<h4>Upcoming Stays</h4>

{loadingBookings ? (
  <p>Loading upcoming stays...</p>
) : (
  <>
    {bookings.filter(b => {
      if (!b.joiningDate) return false;

      const today = new Date().toISOString().split("T")[0];
      return b.joiningDate > today;
    }).length > 0 ? (
      bookings
        .filter(b => {
          if (!b.joiningDate) return false;

          const today = new Date().toISOString().split("T")[0];
          return b.joiningDate > today;
        })
        .map((booking, index) => (
          <div className="booking-card upcoming" key={"upcoming-" + index}>
            <strong>{booking.hostelName}</strong>
            <p>Joining Date: {booking.joiningDate}</p>
            <p>Sharing: {booking.sharingType}</p>
            <p>Status: {booking.status}</p>
          </div>
        ))
    ) : (
      <p>No upcoming stays</p>
    )}
  
  </>
)}
<hr />
<h4>Current Stay</h4>

{loadingStays ? (
  <p>Loading stays...</p>
) : (
  <>
    {stays.filter(s => {
  if (!s.vacateDate) return true;

  const today = new Date().toISOString().split("T")[0];
  return s.vacateDate >= today;
}).length > 0 ? (
  stays
    .filter(s => {
      if (!s.vacateDate) return true;

      const today = new Date().toISOString().split("T")[0];
      return s.vacateDate >= today;
    })
    .map((stay, index) => (
          <div className="booking-card" key={"current-" + index}>
            <strong>{stay.hostelName}</strong>
            <p>Room: {stay.roomNumber}</p>
            <p>Sharing: {stay.sharingType}</p>
            <p>Joined: {stay.joiningDate}</p>
            <p>Payment: {stay.paymentStatus}</p>
 {stay.vacateDate ? (
    <p className="vacate-approved">
      Vacate Date: {stay.vacateDate}
    </p>
  ) : stay.requestedVacateDate ? (
    <p className="vacate-requested">
      Vacate Requested: {stay.requestedVacateDate}
    </p>
  ) : null}

  {/* ✅ Show Request Button only if no request exists */}
  {!stay.requestedVacateDate && !stay.vacateDate && (
  <div className="stay-actions">
    <button onClick={() => openVacateModal(stay.memberId)}>
      Request Vacate
    </button>

    <button
      className="complaint-btn"
      onClick={() => openComplaintModal(stay.hostelId)}
    >
      Raise Complaint
    </button>
  </div>
)}
          </div>
        ))
    ) : (
      <p>No current stay</p>
    )}
  </>
)}
{currentStay && (
  <>
    <h4>PG Updates</h4>

    {loadingUpdates ? (
      <p>Loading updates...</p>
    ) : pgUpdates.length === 0 ? (
      <p>No updates from owner</p>
    ) : (
      pgUpdates.map((update) => (
        <div className="update-card" key={update.id}>
          <strong>{update.title}</strong>
          <p>{update.message}</p>
          <small>
            {new Date(update.createdAt).toLocaleString()}
          </small>
        </div>
      ))
    )}

    <hr />
  </>
)}

<hr />
<h4>Previous Stays</h4>

{stays.filter(s => {
  if (!s.vacateDate) return false;

  const today = new Date().toISOString().split("T")[0];
  return s.vacateDate < today;
}).length > 0 ? (
  stays
    .filter(s => {
      if (!s.vacateDate) return false;

      const today = new Date().toISOString().split("T")[0];
      return s.vacateDate < today;
    })
    .map((stay, index) => (
      <div className="booking-card" key={"prev-" + index}>
        <strong>{stay.hostelName}</strong>
        <p>Room: {stay.roomNumber}</p>
        <p>Sharing: {stay.sharingType}</p>
        <p>Joined: {stay.joiningDate}</p>
        <p>Vacated: {stay.vacateDate}</p>
    {reviews[stay.hostelId] === undefined ? (
  <p>Loading review...</p>
) : reviews[stay.hostelId] === null ? (
  <button onClick={() => openReviewModal(stay.hostelId)}>
    Add Review
  </button>
) : (
  <div className="existing-review">
    <p><b>Your Review:</b></p>
    <div className="existing-stars">
  {[1,2,3,4,5].map((star) => (
    <FaStar
      key={star}
      className={
        reviews[stay.hostelId].rating >= star
          ? "star active"
          : "star"
      }
    />
  ))}
</div>
    <p>{reviews[stay.hostelId].comment}</p>
  </div>
)}
       </div>
    ))
) : (
  <p>No previous stays</p>
)}
        
        
    </>
  );

  case "complaints":
  return (
    <>
      <h3>COMPLAINTS</h3>

      {loadingComplaints ? (
        <p>Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints raised yet.</p>
      ) : (
       complaints.map((complaint) => (
  <div className="user-complaint-card" key={complaint.id}>

    <div className="complaint-top">
      <span className={`complaint-status ${complaint.status}`}>
        {complaint.status}
      </span>

      <small className="complaint-date">
        {new Date(complaint.createdAt).toLocaleDateString()}
      </small>
    </div>

    <p className="complaint-message">
      {complaint.complaint}
    </p>

    <div className="complaint-hostel">
      🏠 {complaint.hostelName}
    </div>

    {complaint.response && (
      <div className="complaint-owner-reply">
        <strong>Owner Reply</strong>
        <p>{complaint.response}</p>
      </div>
    )}

  </div>
))
      )}
    </>
  );

case "notifications":
  return (
    <>
      <h3>NOTIFICATIONS</h3>

      {loadingNotifications ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            className={`notification-card ${!notif.read ? "unread" : ""}`}
          >
       
            
<p>
  
  {notif.type === "member_added" ? (
    <>PG owner added you to <strong>{notif.hostelName}</strong></>
  ) :
  
  notif.type === "pg_update" ? (
    <>🏠 <strong>{notif.hostelName}</strong>: {notif.message}</>
  ) :
  notif.type === "complaint_reply" ? (
    <>{notif.message}</>
  ) : notif.type === "booking_accepted" ? (
    <>✅ Your booking for <strong>{notif.hostelName}</strong>
      {notif.joiningDate && <div>📅 Joining Date: {notif.joiningDate}</div>}
    </>
  ) : notif.type === "booking_rejected" ? (
    <>❌ No vacancy in <strong>{notif.hostelName}</strong></>
  ) : notif.type === "vacate_request" ? (
    <>📝 You requested to vacate <strong>{notif.hostelName}</strong> on {notif.requestedVacateDate}</>
  ) : notif.type === "vacate_accepted" ? (
    <>✅ Your vacate request for <strong>{notif.hostelName}</strong> has been approved</>
  ) : notif.type === "vacate_rejected" ? (
    <>❌ Your vacate request for <strong>{notif.hostelName}</strong> has been rejected</>
  ) : (
    notif.message
  )}
</p>

            <small>
              {new Date(notif.createdAt).toLocaleString()}
            </small>

            {notif.type === "member_added" && !notif.read && (
              <div className="notification-confirm-buttons">
                <button
                  className="confirm-yes"
                  onClick={() =>
                    handleMemberConfirmationFromList(notif.id, true)
                  }
                >
                  Yes
                </button>

                <button
                  className="confirm-no"
                  onClick={() =>
                    handleMemberConfirmationFromList(notif.id, false)
                  }
                >
                  No
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </>
  );


      case "change-password":
        return (
          <>
            <h3>CHANGE PASSWORD</h3>
            <div className="password-form">
              {[
                { label: "Current Password", field: "current", show: showCurrent, setShow: setShowCurrent },
                { label: "New Password", field: "new", show: showNew, setShow: setShowNew },
                { label: "Confirm Password", field: "confirm", show: showConfirm, setShow: setShowConfirm },
              ].map((p, idx) => (
                <div className="form-group password-group" key={idx}>
                  <label>{p.label}</label>

                  <div className="password-input-wrapper">
                    <input
                      type={p.show ? "text" : "password"}
                      placeholder={`Enter ${p.label.toLowerCase()}`}
                      value={passwords[p.field]}
                      onChange={(e) => handlePasswordChange(p.field, e.target.value)}
                      className={p.field === "confirm" && !confirmValid ? "invalid" : ""}
                    />

                    <span onClick={() => p.setShow(!p.show)}>
                      {p.show ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  {p.field === "confirm" && !confirmValid && (
                    <p className="confirm-error">Passwords do not match</p>
                  )}
                </div>
              ))}

              <button className="save-btn" onClick={handleUpdatePassword} disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>

              {passwordMsg && <p className="save-message">{passwordMsg}</p>}
            </div>
          </>
        );

      case "terms":
        return (
          <>
            <h3>TERMS AND CONDITIONS</h3>
            <div className="terms-box">
              <p>Terms and conditions content here...</p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const markAsRead = async (id) => {
  const token = localStorage.getItem("hlopgToken");
  if (!token) return;

  try {
    await api.put(
      `/user/notifications/${id}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update UI instantly
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );

    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));

  } catch (error) {
    console.error("Failed to mark notification as read", error);
  }
};
  return (
    <>
      <div className="account-container">
<div className="user-sidebar">
            <div className={`user-sidebar-greeting ${animateGreeting ? "fade-greeting" : ""}`}>
            Hello, {user?.name || "User"}!
          </div>

          {[
            { id: "basic-info", label: "Basic Information" },
            { id: "liked-pg", label: "Liked PG’s List" },
            { id: "payment-history", label: "Payment History" },
              { id: "my-bookings", label: "My Bookings" },    
          { id: "notifications", label: `Notifications` },
          { id: "complaints", label: "Complaints" },
            { id: "change-password", label: "Change Password" },
            { id: "terms", label: "Terms and Conditions" },
          ].map((section) => (
            <button
  key={section.id}
  className={`user-sidebar-btn ${activeSection === section.id ? "active" : ""}`}
  onClick={() => setActiveSection(section.id)}
>
  {section.label}
</button>
          ))}

         <button className="user-logout-btn" onClick={openLogoutModal}>
  Logout
</button>
        </div>

        <div className="main-content">{renderSection()}</div>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className={`modal ${modalClosing ? "fade-out" : ""}`}>
            <button className="modal-close" onClick={closeLogoutModal}>
              <FaTimes />
            </button>

            <p style={{ fontSize: 20, marginTop: 30 }}>
              Are you sure you want to logout?
            </p>

            <div className="modal-actions">
              <button className="modal-cancel" onClick={closeLogoutModal}>
                Cancel
              </button>
              <button className="modal-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}


      {showVacateModal && (
  <div className="modal-overlay">
<div className="modal vacate-modal">      <h3>Request Vacate</h3>

      <label>Select Vacate Date</label>
      <input
        type="date"
        value={vacateDate}
        onChange={(e) => setVacateDate(e.target.value)}
      />

      <label>Reason (Optional)</label>
      <textarea
        placeholder="Enter reason..."
        value={vacateReason}
        onChange={(e) => setVacateReason(e.target.value)}
      />

      <div className="modal-actions">
        <button onClick={closeVacateModal}>Cancel</button>
        <button onClick={submitVacateRequest}>Submit</button>
      </div>
    </div>
  </div>

  
)}
{showComplaintModal && (
  <div className="modal-overlay complaint-overlay">
    <div className="complaint-modal-card">

      <div className="complaint-header">
        <h2>Raise Complaint</h2>
        <button className="modal-close-btn" onClick={closeComplaintModal}>
          <FaTimes />
        </button>
      </div>

      <p className="complaint-subtext">
        Let the PG owner know about any issue in your room or facility.
      </p>

      <label className="complaint-label">Describe your issue</label>

      <textarea
        className="complaint-textarea"
        placeholder="Example: Water leakage in bathroom, electricity problem, WiFi not working..."
        value={complaintText}
        onChange={(e) => setComplaintText(e.target.value)}
      />

      <div className="complaint-actions">
        <button className="cancel-btn" onClick={closeComplaintModal}>
          Cancel
        </button>

        <button className="submit-btn" onClick={submitComplaint}>
          Submit Complaint
        </button>
      </div>

    </div>
  </div>
)}

{showReviewModal && (
  <div className="modal-overlay">
<div className="modal review-modal">      <h3>Add Review</h3>

     <label>Rating</label>

<div className="star-rating">
  {[1,2,3,4,5].map((star) => (
    <FaStar
      key={star}
      className={`star ${rating >= star ? "active" : ""}`}
      onClick={() => setRating(star)}
    />
  ))}
</div>

      <label>Review</label>
      <input
  type="text"
  placeholder="Write your review..."
  value={comment}
  onChange={(e) => setComment(e.target.value)}
/>

      <div className="modal-actions">
        <button onClick={closeReviewModal}>Cancel</button>
        <button onClick={submitReview}>Submit</button>
      </div>
    </div>
  </div>
)}



{showMemberConfirmModal && selectedNotification && (
  <div
    className="modal-overlay"
    onClick={() => {
      setShowMemberConfirmModal(false);
      setSelectedNotification(null);
    }}
  >
    <div
      className="modal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        className="modal-close"
        onClick={() => {
          setShowMemberConfirmModal(false);
          setSelectedNotification(null);
        }}
      >
        ✖
      </button>

      <h3>Stay Confirmation</h3>

      <p>
        PG owner added you to this PG:
        <br />
<strong>{selectedNotification.hostelName}</strong>
      </p>

      <p>Are you currently staying here?</p>

      <div className="modal-actions">
        <button onClick={() => handleMemberConfirmation(false)}>
          No
        </button>

        <button onClick={() => handleMemberConfirmation(true)}>
          Yes
        </button>
      </div>
    </div>
  </div>
)}
 
    </>
  );
};

export default UserPanel;
