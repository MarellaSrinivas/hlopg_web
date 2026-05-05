import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./HostelPage.css";
import { sendBookingSocket } from "../socket";

import {FaUser, FaSmokingBan, FaWineBottle,  FaPaw,  FaPlus,  FaWifi,  FaFan, FaBed,  FaTv,  FaLightbulb,
  FaChevronLeft,  FaChevronRight,  FaStar,  FaShower,  FaParking,  FaBroom,  FaStarHalfAlt,
  FaRegStar, FaUtensils, FaSnowflake, FaChair, FaDumbbell , 
} from "react-icons/fa";

import api from "../api";

// Fallback images
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.png";


const ruleIcons = {
  "No Smoking": <FaSmokingBan />,
  "No Alcohol": <FaWineBottle />,
  "No Pets": <FaPaw />,
  "Keep Clean": <FaBroom />,
};
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];


/* ⭐ Render Star Ratings */
const renderStars = (rating = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="review-star" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="review-star" />);
  }

  while (stars.length < 5) {
    stars.push(
      <FaRegStar key={`empty-${stars.length}`} className="review-star" />
    );
  }

  return <div className="stars-container">{stars}</div>;
};

const HostelPage = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
const [reviews, setReviews] = useState([]);
const [reviewLoading, setReviewLoading] = useState(true);
const [currentReview, setCurrentReview] = useState(0);

const nextReview = () => {
  setCurrentReview((prev) =>
    prev === reviews.length - 1 ? 0 : prev + 1
  );
};

const prevReview = () => {
  setCurrentReview((prev) =>
    prev === 0 ? reviews.length - 1 : prev - 1
  );
};

const [isSubscribed, setIsSubscribed] = useState(false);
const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [hostelData, setHostelData] = useState(null);
  const [foodMenu, setFoodMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const normalizedMenu = DAYS_OF_WEEK.map((dayName, index) => ({
  day: dayName,
  breakfast: foodMenu[index]?.breakfast || "-",
  lunch: foodMenu[index]?.lunch || "-",
  dinner: foodMenu[index]?.dinner || "-",
}));

  const dummyReviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.5,
      comment:
        "Great PG, clean facilities and friendly staff. Food quality is excellent!",
      date: "2 weeks ago",
    },
    {
      id: 2,
      name: "Priya Patel",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.0,
      comment:
        "Good location and well-maintained rooms. WiFi could be better though.",
      date: "1 month ago",
    },
    {
      id: 3,
      name: "Amit Kumar",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 5.0,
      comment: "Best PG in the area! Owner is very cooperative and helpful.",
      date: "3 days ago",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 3.5,
      comment: "Affordable price but need more parking space.",
      date: "2 months ago",
    },
    {
      id: 5,
      name: "Vikram Singh",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.0,
      comment: "Clean rooms and good food. Would recommend!",
      date: "1 week ago",
    },
  ];

  const avgRating =
    dummyReviews.reduce((sum, r) => sum + r.rating, 0) / dummyReviews.length;
  const totalReviews = dummyReviews.length;



  // ================= FETCH HOSTEL DETAILS =================
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        console.log("🏠 Fetching hostel with ID:", hostelId);

        const res = await api.get(`/hostel/${hostelId}`);
        console.log("✅ Hostel API response:", res.data);

        if (res.data.success) {
          const data = res.data.data;

          // ✅ Fix image URLs correctly
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            data.images = data.images.map((img) => {
              if (!img) return pg1;

              if (img.startsWith("http")) return img;

              if (img.startsWith("/uploads")) {
                return `https://api.hlopg.com${img}`;
              }

              return `https://api.hlopg.com/uploads/${img}`;
            });
          } else if (data.img) {
            const mainImg = data.img.startsWith("http")
              ? data.img
              : data.img.startsWith("/uploads")
              ? `https://api.hlopg.com${data.img}`
              : `https://api.hlopg.com/${data.img}`;

            data.images = [mainImg];
          } else {
            data.images = [pg1, pg2, pg3, pg4, pg5];
          }

          setHostelData(data);
        } else {
          setHostelData(null);
        }
      } catch (err) {
        console.error("❌ Error fetching hostel:", err);
        setHostelData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [hostelId]);



  useEffect(() => {

  const fetchReviews = async () => {
    try {

      setReviewLoading(true);

      const res = await api.get(`/reviews/hostel/${hostelId}`);

      console.log("Reviews API:", res.data);

      if (res.data.success) {
        setReviews(res.data.reviews || []);
      } else {
        setReviews([]);
      }

    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  if (hostelId) {
    fetchReviews();
  }

}, [hostelId]);
  
  // ================= FETCH USER SUBSCRIPTION =================


 useEffect(() => {
  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem("hlopgToken");
      if (!token) return;

      const res = await api.get("/auth/check-subscription", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Subscription response:", res.data);

      if (res.data.success && res.data.active === true) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }

    } catch (err) {
      console.error("Subscription check failed:", err);
      setIsSubscribed(false);
    }
  };

  checkSubscription();
}, []);
  // Fetch food menu
   useEffect(() => {
     const fetchFoodMenu = async () => {
       try {
         console.log("🔄 Fetching food menu for hostel:", hostelId);
         
         if (!hostelId) {
           console.log("⚠️ No hostel ID available");
           setFoodMenu([]);
           setMenuLoading(false);
           return;
         }
 
         // Try to fetch from API endpoints first
         console.log("🌐 Trying to fetch food menu from API...");
         
         const endpoints = [
           `/food_menu/${hostelId}`,
           `/hostel/food_menu/${hostelId}`,
           `/hostel/${hostelId}/food_menu`,
           `/hostel/${hostelId}/menu`,
           `/menu/${hostelId}`
         ];
         
         let foodData = null;
         let found = false;
         
         for (const endpoint of endpoints) {
           try {
             console.log(`🔍 Trying endpoint: ${endpoint}`);
             const res = await api.get(endpoint);
             console.log(`📡 Response from ${endpoint}:`, res.data);
             
             if (res.data.success || res.data.ok || res.data.data || res.data.menu) {
               foodData = res.data.data || res.data.menu || res.data.food_menu || res.data;
               console.log("✅ Food data found from API:", foodData);
               found = true;
               break;
             }
           } catch (err) {
             console.log(`❌ Endpoint ${endpoint} failed:`, err.message);
           }
         }
         
         // If no API data found, check if it's in hostelData (which might be fetched later)
         if (!found && hostelData?.food_menu) {
           console.log("📦 Food menu found in hostel data:", hostelData.food_menu);
           foodData = hostelData.food_menu;
           found = true;
         }
         
         if (found && foodData) {
           processFoodData(foodData);
         } else {
           console.log("⚠️ No food menu data found");
           setFoodMenu([]);
         }
         
       } catch (err) {
         console.error("❌ Error in fetchFoodMenu:", err);
         console.error("Error response:", err.response?.data);
         setFoodMenu([]);
       } finally {
         setMenuLoading(false);
       }
     };
     
     // Helper function to process food data
     const processFoodData = (foodData) => {
       console.log("🔧 Processing food data:", foodData);
       
       try {
         let processedMenu = [];
         
         // Parse if it's a string
         if (typeof foodData === 'string') {
           try {
             foodData = JSON.parse(foodData);
             console.log("✅ Parsed food menu JSON:", foodData);
           } catch (parseError) {
             console.error("❌ Failed to parse food menu JSON:", parseError);
             setFoodMenu([]);
             return;
           }
         }
         
         // Case 1: Object with breakfast, lunch, dinner properties
         if (foodData.breakfast || foodData.lunch || foodData.dinner) {
           const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
           
           processedMenu = days.map(day => ({
             day: day.charAt(0).toUpperCase() + day.slice(1),
             breakfast: foodData.breakfast?.[day] || foodData.breakfast?.[day.toUpperCase()] || foodData.breakfast || "-",
             lunch: foodData.lunch?.[day] || foodData.lunch?.[day.toUpperCase()] || foodData.lunch || "-",
             dinner: foodData.dinner?.[day] || foodData.dinner?.[day.toUpperCase()] || foodData.dinner || "-"
           }));
           
           console.log("📅 Processed weekly menu:", processedMenu);
         }
         // Case 2: Array format
         else if (Array.isArray(foodData)) {
           processedMenu = foodData.map(item => ({
             day: item.day || item.Day || "Day " + (item.id || ""),
             breakfast: item.breakfast || item.Breakfast || "-",
             lunch: item.lunch || item.Lunch || "-",
             dinner: item.dinner || item.Dinner || "-"
           }));
           
           console.log("📅 Processed array menu:", processedMenu);
         }
         // Case 3: Object with day keys
         else if (typeof foodData === 'object' && foodData !== null) {
           processedMenu = Object.entries(foodData).map(([day, menu]) => ({
             day: day.charAt(0).toUpperCase() + day.slice(1),
             breakfast: menu.breakfast || menu.Breakfast || "-",
             lunch: menu.lunch || menu.Lunch || "-",
             dinner: menu.dinner || menu.Dinner || "-"
           }));
           
           console.log("📅 Processed object menu:", processedMenu);
         }
         else {
           console.log("⚠️ Unknown food data format:", foodData);
           processedMenu = [];
         }
         
         setFoodMenu(processedMenu);
         
       } catch (error) {
         console.error("❌ Error processing food data:", error);
         setFoodMenu([]);
       }
     };
     
     // Only fetch when we have hostelId
     if (hostelId) {
       console.log("🚀 Starting food menu fetch...");
       fetchFoodMenu();
     }
   }, [hostelId]);


   useEffect(() => {
  const html = document.documentElement;

  if (isPopupOpen) {
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    html.style.overflow = "hidden";
  } else {
    const scrollY = document.body.style.top;

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";

    html.style.overflow = "";

    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY) * -1);
    }
  }
}, [isPopupOpen]);
  // ================= IMAGE CAROUSEL =================
  const images =
    hostelData?.images && hostelData.images.length > 0
      ? hostelData.images
      : [pg1, pg2, pg3, pg4, pg5];

  const prevImage = () =>
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextImage = () =>
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));



  const activateFreeSubscription = async () => {
  try {
    const token = localStorage.getItem("hlopgToken");

    if (!token) {
      navigate("/StudentLogin");
      return;
    }

    const res = await api.post(
      "/auth/activate-free-subscription",
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (res.data.success) {
      alert("🎉 Free 6 Months Subscription Activated!");

      setIsSubscribed(true);
      setShowSubscriptionPopup(false);
    } else {
      alert(res.data.message || "Subscription failed");
    }

  } catch (err) {
    console.error("Subscription activation error:", err);
  }
};
  // ================= BOOK NOW BUTTON =================
 const handleBookNow = async () => {
  try {
    const token = localStorage.getItem("hlopgToken");
    const role = localStorage.getItem("hlopgRole");

    if (!token) {
      navigate("/StudentLogin", { state: { from: location.pathname } });
      return;
    }

    if (role !== "USER") {
      alert("Only students can book this PG.");
      return;
    }

    // 🔥 Always fetch fresh user from backend
    const res = await api.get("/auth/userid", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const currentUser = res.data;

    navigate(`/booking/${hostelId}`, {
      state: {
        hostelData,
        user: currentUser,
      },
    });

  } catch (err) {
    console.error("Booking error:", err);
    alert("Something went wrong. Please login again.");
  }
};
  // ================= CREATE BOOKING REQUEST =================
  const handleCreateBooking = async (bookingData) => {
    try {
      setBookingLoading(true);

      if (!bookingData.user) {
        alert("Please provide your information");
        return;
      }

      const currentUser = bookingData.user;

     const bookingPayload = {
  hostelId: parseInt(hostelId),
  userId: currentUser.id,           
  userName: currentUser.name,
  userEmail: currentUser.email,
  userMobile: currentUser.phone,
    sharingType: bookingData.sharing,
};

      console.log("📤 Sending booking payload:", bookingPayload);

      const token = localStorage.getItem("hlopgToken");

      const bookingRes = await api.post("/booking/request", bookingPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Booking response:", bookingRes.data);

      if (bookingRes.data.success) {
        // alert(
        //   `✅ Booking Request Sent Successfully!\n\n🏠 PG: ${hostelData.hostel_name}\n📍 Location: ${
        //     hostelData.address || hostelData.city
        //   }\n🛏️ Sharing: ${bookingData.sharing}\n\n📞 Owner will contact you soon.`
        // );

        // localStorage.setItem("hlopgUser", JSON.stringify(currentUser));
        // setIsPopupOpen(false);

        // 🔔 Send Real-time Notification to Owner
  sendBookingSocket({
    ownerId: hostelData.owner_id,  // Make sure backend sends this
    studentName: currentUser.name,
    pgName: hostelData.hostel_name,
    sharingType: bookingData.sharing
  });

  alert(
    `✅ Booking Request Sent Successfully!\n\n🏠 PG: ${hostelData.hostel_name}`
  );
      } else {
        alert("Booking failed: " + (bookingRes.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Booking error:", err);
      alert("Booking request failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

 // ================= BOOKING POPUP =================
const BookingPopup = ({ onClose, onSubmit }) => {
  const [selectedSharing, setSelectedSharing] = useState("single");

  const sharingOptions = hostelData?.sharing_data
    ? Object.entries(hostelData.sharing_data).map(([type, price]) => ({
        value: type,
        label: `${type.toUpperCase()} - ₹${price}/month`,
      }))
    : [
        { value: "single", label: "Single Sharing" },
        { value: "double", label: "Double Sharing" },
        { value: "triple", label: "Triple Sharing" },
      ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user?.name || !user?.email || !user?.phone) {
      alert("User information missing. Please login again.");
      return;
    }

    onSubmit({
      sharing: selectedSharing,
      user: user,
    });
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="booking-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="popup-header">
          <h3>Book PG</h3>
          <button className="close-popup" onClick={onClose}>
            ×
          </button>
        </div>

        {/* PG & OWNER DETAILS */}
        <div className="pg-owner-info">
          <p><strong>PG Name:</strong> {hostelData?.hostel_name}</p>
          <p><strong>Owner Name:</strong> {hostelData?.owner_name || "N/A"}</p>
          <p><strong>Owner Phone:</strong> {hostelData?.owner_phone || "N/A"}</p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">

          {/* USER DETAILS (READ ONLY) */}
          {/* USER DETAILS DISPLAY */}
<div className="user-display-card">
  <div className="user-row">
    <span className="label">Name</span>
    <span className="value">: {user?.name || "N/A"}</span>
  </div>

  <div className="user-row">
    <span className="label">Email</span>
    <span className="value">: {user?.email || "N/A"}</span>
  </div>

  <div className="user-row">
    <span className="label">Phone</span>
    <span className="value">: {user?.phone || "N/A"}</span>
  </div>
</div>

          {/* SHARING OPTION */}
          <div className="form-group">
            <label>Select Sharing *</label>
            <select
              value={selectedSharing}
              onChange={(e) => setSelectedSharing(e.target.value)}
            >
              {sharingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* ACTIONS */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="submit-btn">
              Send Booking Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

  // ================= LOADING / ERROR =================
  if (loading) return <div className="loading">Loading hostel details...</div>;
  if (!hostelData) return <div className="error">No hostel found.</div>;

  return (
    <div className="hostel-page">
      {/* MAIN SECTION */}
      <div className="hostel-main">
        {/* LEFT IMAGES */}
        <div className="hostel-images">
                  <h4 className="black-text">Name : {hostelData.hostel_name}</h4>

          <div className="main-img">
            <button className="arrow-left" onClick={prevImage}>
              <FaChevronLeft />
            </button>

            <img
              src={images[mainImageIndex]}
              alt="Room"
              onError={(e) => {
                e.target.src = pg1;
              }}
            />

            <button className="arrow-right" onClick={nextImage}>
              <FaChevronRight />
            </button>
          </div>

          <div className="thumbnail-container">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx}`}
                className={mainImageIndex === idx ? "active-thumb" : ""}
                onClick={() => setMainImageIndex(idx)}
                onError={(e) => {
                  e.target.src = pg1;
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT DETAILS */}
<div className={`hostel-details ${!isSubscribed ? "blur-details" : ""}`}>
            <h2 className="black-text">  {hostelData.hostel_name}</h2>
          <p className="black-text"> {hostelData.area}, {hostelData.city || ""}</p>
          <p className="black-text">
            <b>Type of Living:</b> {hostelData.pg_type}'s PG
          </p>

         {/* Pricing */}
             <b>Sharing </b>  
 <div className="sharing-wrapper">
  {Object.entries(hostelData.sharing_data).map(([sharing, price], idx) => {
    const label =
      sharing === "single" ? "1 " :
      sharing === "double" ? "2 " :
      sharing === "triple" ? "3 " :
      sharing === "four" ? "4 " :
      sharing === "five" ? "5 " :
      sharing === "six" ? "6 " :
      sharing;

    return (
      <div key={idx} className="sharing-item">
        <div className="sharing-circle">
          <span className="sharing-count">{label} 
          <FaUser className="sharing-icon" /></span>

        </div>
      <div className="sharing-price">₹{price}</div>

      </div>

    );
  })}
</div>
          <p className="black-text"><strong>Amenities</strong></p>
          <div className="furnished-icons">
            
           {hostelData.facilities?.wifi && <span><FaWifi /> Free WiFi</span>}
  {hostelData.facilities?.fan && <span><FaFan /> Fan</span>}
  {hostelData.facilities?.ac && <span><FaSnowflake /> AC</span>}
  {hostelData.facilities?.bed && <span><FaBed /> Bed</span>}
  {hostelData.facilities?.lights && <span><FaLightbulb /> Lights</span>}
  {hostelData.facilities?.cupboard && <span><FaChair /> Cupboard</span>}
  {hostelData.facilities?.geyser && <span><FaShower /> Geyser</span>}
  {hostelData.facilities?.water && <span><FaUtensils /> Water</span>}
  {hostelData.facilities?.gym && <span><FaDumbbell /> Gym</span>}
  {hostelData.facilities?.tv && <span><FaTv /> TV</span>}
  {hostelData.facilities?.food && <span><FaUtensils /> Food</span>}
  {hostelData.facilities?.parking && <span><FaParking /> Parking</span>}
          </div>


{/* RULES SECTION */}
{hostelData.rules && hostelData.rules.length > 0 && (
  <>
    <p className="black-text"><strong>Rules</strong></p>
    <div className="pg-rules">
      {hostelData.rules.map((rule, index) => (
<div key={index} className="pg-rule-item">
          <span className="rule-icon">
            {ruleIcons[rule] || <FaPlus />}
          {rule}</span>
        </div>
      ))}
    </div>
  </>
)}


<h3 className="avg-rating">
⭐ {hostelData.rating?.toFixed(1)} ({hostelData.reviews} Reviews)
</h3>
{/* REVIEWS */}
<div className="reviews-section">
  <h2 className="black-text">PG Reviews</h2>

  {reviewLoading ? (
    <p>Loading reviews...</p>
  ) : reviews.length === 0 ? (
    <p>No reviews yet.</p>
  ) : (
    <div className="review-slider-container">

      <button className="review-arrow left" onClick={prevReview}>
        <FaChevronLeft />
      </button>

      <div className="review-card">

        <div className="review-content-box">

          {renderStars(reviews[currentReview]?.rating)}

          <p className="review-text">
            {reviews[currentReview]?.comment}
          </p>

          <h4 className="review-name">
            — {reviews[currentReview]?.name || "Anonymous"}
          </h4>

        </div>

      </div>

      <button className="review-arrow right" onClick={nextReview}>
        <FaChevronRight />
      </button>

    </div>
  )}
</div>


           
        </div>
      </div>
  
     {/* Food Menu */}
<div className="food-menu">
  <h2 className="food-menu-title">Food Menu</h2>

  {menuLoading ? (
    <div className="loading-food">Loading food menu...</div>
  ) : foodMenu.length > 0 ? (
    <div className="food-menu-grid">

      {/* Days Column */}
      <div className="food-col days-col">
        <div className="food-col-header">Days</div>
        {foodMenu.map((item, idx) => (
          <div key={idx} className="food-cell day-cell">
            {item.day.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Breakfast Column */}
      <div className="food-col breakfast-col">
        <div className="food-col-header breakfast-header">
          Breakfast (07:30 - 10:00)
        </div>
        {foodMenu.map((item, idx) => (
          <div key={idx} className="food-cell">
            {item.breakfast || "-"}
          </div>
        ))}
      </div>

      {/* Lunch Column */}
      <div className="food-col lunch-col">
        <div className="food-col-header lunch-header">
          Lunch (12:30 - 02:00)
        </div>
        {foodMenu.map((item, idx) => (
          <div key={idx} className="food-cell">
            {item.lunch || "-"}
          </div>
        ))}
      </div>

      {/* Dinner Column */}
      <div className="food-col dinner-col">
        <div className="food-col-header dinner-header">
          Dinner (07:30 - 10:00)
        </div>
        {foodMenu.map((item, idx) => (
          <div key={idx} className="food-cell">
            {item.dinner || "-"}
          </div>
        ))}
      </div>

    </div>
  ) : (
    <div className="no-food-menu">
      🍽️ No food menu available
    </div>
  )}
</div>


      {/* BOOK NOW BUTTON */}
      <div className="book-now">
        <button
  className="book-now-btn"
  onClick={handleBookNow}
  disabled={!isSubscribed}
>
          Book Now
        </button>
        <p className="booking-note-small">
          {/* No payment required. Owner will contact you directly. */}
        </p>
      </div>

      {/* POPUP */}
      {isPopupOpen && (
        <BookingPopup
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleCreateBooking}
        />
      )}


   {showSubscriptionPopup && !isSubscribed && (
  <div className="subscription-overlay">
    <div className="subscription-popup">

      {/* Close Button */}
      <button
        className="popup-close"
        onClick={() => setShowSubscriptionPopup(false)}
      >
        ✕
      </button>

      <h2>🎁 Free Subscription</h2>

      <p>
        Unlock full PG details, location and booking access.
      </p>

      <h3 style={{ color: "#28a745" }}>
        6 Months Free Access
      </h3>

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

export default HostelPage;

