import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { sendBookingSocket } from "../socket";
import "./BookingPage.css";

const BookingPage = () => {
  const { hostelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [vacateDate, setVacateDate] = useState("");

  const { hostelData, user } = location.state || {};

  const [isStaying, setIsStaying] = useState(null);  
  const [roomNumber, setRoomNumber] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [selectedSharing, setSelectedSharing] = useState("single");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!hostelData) {
    return <div>Invalid Booking Access</div>;
  }

  const sharingOptions = hostelData?.sharing_data
    ? Object.entries(hostelData.sharing_data)
    : [];

  const handleSubmit = async () => {
    // 🔴 Validation
    if (isStaying === null) {
      alert("Please select whether you are staying in this PG");
      return;
    }
    if (isStaying && joiningDate > maxJoiningDate) {
  alert("Joining date cannot be future date");
  return;
}


    if (isStaying && (!roomNumber || !joiningDate)) {
      alert("Please enter room number and joining date");
      return;
    }

    if (!isStaying && !joiningDate) {
      alert("Please select expected joining date");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("hlopgToken");

      // 🟢 CASE 1: Already Staying → NEW API
      if (isStaying) {
        const existingPayload = {
          hostelId: parseInt(hostelId),
          userId: user.id,
          roomNumber,
          sharingType: selectedSharing,
          joiningDate,
            vacateDate: vacateDate || null

        };

        await api.post("/members/existing-student", existingPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } 
      // 🔵 CASE 2: New Booking → OLD API
      else {
        const bookingPayload = {
          hostelId: parseInt(hostelId),
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userMobile: user.phone,
          sharingType: selectedSharing,
          joiningDate,
        };

        await api.post("/booking/request", bookingPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      // 🔔 Optional: Send socket only for new booking
      if (!isStaying) {
        sendBookingSocket({
          ownerId: hostelData.owner_id,
          studentName: user.name,
          pgName: hostelData.hostel_name,
          sharingType: selectedSharing,
        });
      }

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/user-dashboard", {
          state: { openSection: "my-bookings" },
        });
      }, 2500);

    } catch (err) {
      console.error(err);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // Get yesterday's date (YYYY-MM-DD format)
const today = new Date();
today.setDate(today.getDate() - 1);
const maxJoiningDate = today.toISOString().split("T")[0];

 return (
  <div className="booking-page">
    <div className="booking-container">

      {/* LEFT CARD */}
      <div className="left-card">
        <div className="hostel-image">
          <img src={hostelData.images?.[0]} alt="hostel" />
        </div>

        <div className="hostel-info">
          <h2>{hostelData.hostel_name}</h2> 
          <p><strong>Owner:</strong> {hostelData.owner_name}</p>
          <p><strong>Phone:</strong> {hostelData.owner_phone}</p>
        </div>

        <div className="user-box">
          <p><strong>{user.name}</strong></p>
          <p>{user.email}</p>
          <p>{user.phone}</p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="right-card">
        <h3>Are you already staying in this PG?</h3>

        <div className="toggle-group">
  <button
    className={`toggle-btn ${isStaying === true ? "active" : ""}`}
    onClick={() => setIsStaying(true)}
  >
    Yes
  </button>

  <button
    className={`toggle-btn ${isStaying === false ? "active" : ""}`}
    onClick={() => setIsStaying(false)}
  >
    No
  </button>
</div>

        {/* YES */}
        {isStaying === true && (
          <>
            <input
              placeholder="Room Number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
              <p>Select Sharing Type</p>

            <div className="row">
              <select
                value={selectedSharing}
                onChange={(e) => setSelectedSharing(e.target.value)}
              >
                {sharingOptions.map(([type, price]) => (
                  <option key={type} value={type}>
                    {type.toUpperCase()} - ₹{price}
                  </option>
                ))}
              </select>

             
            </div>
                <p style={{ marginTop: "20px" }}>Joining Date & Vacate Date</p>
            <div className="row">
               <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                max={maxJoiningDate}
              />
              <input
                type="date"
                value={vacateDate}
                onChange={(e) => setVacateDate(e.target.value)}
              />
            </div>
          </>
        )}

        {/* NO */}
        {isStaying === false && (
          <>
          <p>Select Sharing Type           </p>
            <select
              value={selectedSharing}
              onChange={(e) => setSelectedSharing(e.target.value)}
            >
              {sharingOptions.map(([type, price]) => (
                <option key={type} value={type}>
                  {type.toUpperCase()} - ₹{price}
                </option>
              ))}
            </select>
              <p style={{ marginTop: "20px" }}>Expected Joining Date</p>
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </>
        )}

        <div className="actions">
          <button className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading || isStaying === null}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default BookingPage;


