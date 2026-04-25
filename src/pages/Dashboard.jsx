// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import api from "../api";

// Image Imports
import pgDefaultImg from "../assets/pg1.png";
import { FaStar, FaRegStar, FaStarHalfAlt, FaUser } from "react-icons/fa";

const Dashboard = ({ user, notifications }) => {
  const token = localStorage.getItem("hlopgToken");

  /* ================= STATES ================= */
  const [selectedComplaintHostelId, setSelectedComplaintHostelId] = useState("all");

  const [updateTarget, setUpdateTarget] = useState("single"); 
  const [pgs, setPgs] = useState([]);
  const [loadingPGs, setLoadingPGs] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  // const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [selectedHostelId, setSelectedHostelId] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
const [loadingComplaints, setLoadingComplaints] = useState(false);
const [showReplyModal, setShowReplyModal] = useState(false);
const [selectedComplaintId, setSelectedComplaintId] = useState(null);
const [replyText, setReplyText] = useState("");

const [pgUpdates, setPgUpdates] = useState([]);
const [showUpdateModal, setShowUpdateModal] = useState(false);
const [updateTitle, setUpdateTitle] = useState("");
const [updateMessage, setUpdateMessage] = useState("");

const openReplyModal = (complaintId) => {
  setSelectedComplaintId(complaintId);
  setShowReplyModal(true);
};

const closeReplyModal = () => {
  setShowReplyModal(false);
  setSelectedComplaintId(null);
  setReplyText("");
};

const submitReply = async () => {
  try {
    const token = localStorage.getItem("hlopgToken");

    if (!replyText.trim()) {
      alert("Response cannot be empty");
      return;
    }

    await api.post(
      "/complaints/reply",
      {
        complaint_id: selectedComplaintId,
        response: replyText,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Reply submitted successfully");

    closeReplyModal();

    // refresh complaints
    fetchComplaints();

  } catch (error) {
    console.error("Reply failed:", error);
  }
};

const fetchUpdates = async (hostelId) => {
  try {
    const res = await api.get(`/updates/hostel/${hostelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      setPgUpdates(res.data.updates);
    }

  } catch (err) {
    console.error("Failed to fetch updates:", err);
  }
};

useEffect(() => {

  const fetchAllUpdates = async () => {
    try {

      const promises = pgs.map((pg) =>
        api.get(`/updates/hostel/${pg.hostel_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const results = await Promise.all(promises);

      let allUpdates = [];

      results.forEach((res, idx) => {
        if (res.data.success) {

          const updates = res.data.updates.map((u) => ({
            ...u,
            hostelName: pgs[idx].hostel_name
          }));

          allUpdates.push(...updates);
        }
      });

      // newest first
      allUpdates.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));

      setPgUpdates(allUpdates);

    } catch(err){
      console.error("All PG updates failed", err);
    }
  };

  if (!selectedHostelId) return;

  if (selectedHostelId === "all") {
    fetchAllUpdates();
  } else {
    fetchUpdates(selectedHostelId);
  }

}, [selectedHostelId, pgs]);
const addUpdate = async () => {
  try {

    if (!updateTitle || !updateMessage) {
      alert("Title and message required");
      return;
    }

    if (selectedHostelId === "all") {

      // send update to all PGs
      const promises = pgs.map((pg) =>
        api.post(
          "/updates/add",
          {
            hostel_id: pg.hostel_id,
            title: updateTitle,
            message: updateMessage
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );

      await Promise.all(promises);

    } else {

      // send update to selected PG
      await api.post(
        "/updates/add",
        {
          hostel_id: selectedHostelId,
          title: updateTitle,
          message: updateMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

    }

    setShowUpdateModal(false);
    setUpdateTitle("");
    setUpdateMessage("");

    if (selectedHostelId !== "all") {
      fetchUpdates(selectedHostelId);
    }

  } catch (error) {
    console.error("Update failed:", error);
  }
};

const deleteUpdate = async (id) => {
  try {

    await api.delete(`/updates/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchUpdates(selectedHostelId);

  } catch (error) {
    console.error("Delete failed:", error);
  }
};

  /* ================= FETCH MY PGs ================= */
  useEffect(() => {
    const fetchOwnerPGs = async () => {
      try {
        const res = await api.get("/hostel/owner/pgs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const pgData = res.data.data || res.data.hostels || [];
          const processedPGs = pgData.map((pg) => {
            let displayImage = pgDefaultImg;

            if (pg.images && pg.images.length > 0) {
              const img = pg.images[0];
              if (img.startsWith("http")) displayImage = img;
              else if (img.startsWith("/")) displayImage = `http://18.61.100.138:8080${img}`;
              else displayImage = `http://18.61.100.138:8080/uploads/${img}`;
            } else if (pg.img) {
              displayImage = pg.img.startsWith("http") ? pg.img : `http://18.61.100.138:8080${pg.img}`;
            }

            return {
              ...pg,
              displayImage,
              hostel_name: pg.hostel_name || pg.name,
            };
          });

          setPgs(processedPGs);
if (processedPGs.length > 0) {
  setSelectedHostelId("all");
}


          // ✅ Fetch all reviews after PGs are loaded
          fetchAllPGReviews(processedPGs);
        }
      } catch (err) {
        console.error("PG fetch failed", err);
      } finally {
        setLoadingPGs(false);
      }
    };

    if (token) fetchOwnerPGs();
  }, [token]);

  /* ================= FETCH ALL PG REVIEWS ================= */
  const fetchAllPGReviews = async (pgList) => {
    if (!pgList.length || !token) return;

    try {
      const reviewPromises = pgList.map((pg) =>
        api.get(`/reviews/hostel/${pg.hostel_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const results = await Promise.all(reviewPromises);

      let allReviews = [];

      results.forEach((res, idx) => {
        if (res.data?.reviews && Array.isArray(res.data.reviews)) {
          const pgReviews = res.data.reviews.map((r) => ({
            id: r.id,
            reviewer: r.studentName || r.reviewer || "Anonymous",
            rating: r.rating || 0,
            message: r.comment || r.message || "",
            createdAt: r.createdAt || new Date(),
            pgName: pgList[idx].hostel_name,
          }));
          allReviews.push(...pgReviews);
        }
      });

      allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setRecentReviews(allReviews.slice(0, 5));
      console.log("Recent Reviews:", allReviews.slice(0, 5));
    } catch (err) {
      console.error("Fetching PG reviews failed:", err);
      setRecentReviews([]);
    }
  };

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/dashboard/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setDashboardData(res.data.dashboard);
        }
      } catch (err) {
        console.warn("Dashboard API error:", err);
        // Sample fallback data
        setDashboardData({
          totalBookings: 23,
          totalRevenue: 125000,
          bookingChart: [
            { month: "Jan", bookings: 12, revenue: 85000 },
            { month: "Feb", bookings: 18, revenue: 95000 },
            { month: "Mar", bookings: 15, revenue: 105000 },
            { month: "Apr", bookings: 22, revenue: 115000 },
            { month: "May", bookings: 25, revenue: 125000 },
            { month: "Jun", bookings: 28, revenue: 135000 },
          ],
        });
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  /* ================= FETCH RECENT COMPLAINTS ================= */

useEffect(() => {
  if (pgs.length > 0 && selectedComplaintHostelId) {
    fetchComplaints();
  }
}, [selectedComplaintHostelId, pgs]);

 const fetchComplaints = async () => {
  try {

    if (!selectedComplaintHostelId) return;

    setLoadingComplaints(true);

    if (selectedComplaintHostelId === "all") {

      const promises = pgs.map((pg) =>
        api.get(`/complaints/hostel/${pg.hostel_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const results = await Promise.all(promises);

      let allComplaints = [];

      results.forEach((res) => {
        if (res.data.success) {
          allComplaints.push(...res.data.complaints);
        }
      });

allComplaints.sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);

setRecentComplaints(allComplaints);
    } else {

      const res = await api.get(`/complaints/hostel/${selectedComplaintHostelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setRecentComplaints(res.data.complaints);
      } else {
        setRecentComplaints([]);
      }

    }

  } catch (error) {
    console.error("Failed to fetch complaints:", error);
    setRecentComplaints([]);
  } finally {
    setLoadingComplaints(false);
  }
};

  /* ================= RENDER STARS ================= */
  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} color="#FFD700" />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" color="#FFD700" />);
    while (stars.length < 5) stars.push(<FaRegStar key={`empty-${stars.length}`} color="#FFD700" />);

    return <div className="stars">{stars}</div>;
  };

  /* ================= LOADING STATE ================= */
  if (loadingPGs) {
    return (
      <div className="dashboard-container">
        <h3 className="welcome-text">Loading Dashboard...</h3>
      </div>
    );
  }

  /* ================= MAIN DASHBOARD RENDER ================= */
  return (
    <div className="dashboard-container">
      {/* Greeting */}
      <h3 className="welcome-text">
        Hi, <span className="highlight">{user?.name || "Owner"}</span>. Welcome to <span className="highlight">HloPG</span> Admin!
      </h3>

      {/* ================= MY PGs ================= */}
      <section className="my-pgs-section">
        <h4 className="section-title">My PG's</h4>
        {pgs.length === 0 ? (
          <div className="no-pgs"><p>No PGs found. Upload your first PG!</p></div>
        ) : (
          <div className="pg-cards-grid">
            {pgs.map((pg) => (
              <div className="dashboard-pg-card" key={pg.hostel_id || pg.id}>
                <div className="pg-card-image">
                  <img
                    src={pg.displayImage}
                    alt={pg.hostel_name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = pgDefaultImg;
                    }}
                  />
                </div>
                <div className="pg-card-name">{pg.hostel_name}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= NOTIFICATIONS ================= */}
      <section className="notifications-section">
        <h4 className="section-title">New Notifications</h4>
        {notifications.length === 0 ? (
          <p className="no-data">No new bookings</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="notification-card">
              <p><strong>{n.studentName}</strong> booked <strong>{n.pgName} Hostel</strong></p>
              <p>📞 {n.phone}</p>
              <p>🛏 {n.sharingType} Sharing</p>
              <small>{n.time}</small>
            </div>
          ))
        )}
      </section>

      {/* ================= BOOKINGS & REVENUE CHART ================= */}
      {dashboardData?.bookingChart && (
        <section className="bookings-section">
          <h4 className="section-title">Bookings & Revenue Trend</h4>
          <div className="chart-container">
            <div className="chart-header">
              <div className="chart-stats">
                <div className="chart-stat">
                  <span className="stat-label">Total Bookings</span>
                  <span className="stat-value">{dashboardData.totalBookings || 0}</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value">₹{dashboardData.totalRevenue?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>

            <div className="chart-wrapper">
              <div className="y-axis">
                <span>Revenue (₹)</span>
                <div className="y-labels">
                  <span>150K</span>
                  <span>120K</span>
                  <span>90K</span>
                  <span>60K</span>
                  <span>30K</span>
                  <span>0</span>
                </div>
              </div>

              <div className="chart-content">
                <div className="x-axis">
                  {dashboardData.bookingChart.map((item) => (
                    <span key={item.month} className="x-label">{item.month}</span>
                  ))}
                </div>

                <div className="chart-bars">
                  {dashboardData.bookingChart.map((item) => (
                    <div key={item.month} className="chart-bar-container">
                      <div
                        className="chart-bar revenue"
                        style={{ height: `${(item.revenue / 150000) * 100}%` }}
                        title={`Revenue: ₹${item.revenue.toLocaleString()}`}
                      ></div>
                      <div
                        className="chart-bar bookings"
                        style={{ height: `${(item.bookings / 30) * 100}%` }}
                        title={`Bookings: ${item.bookings}`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="chart-legend">
              <div className="legend-item"><div className="legend-color revenue"></div><span>Revenue</span></div>
              <div className="legend-item"><div className="legend-color bookings"></div><span>Bookings</span></div>
            </div>
          </div>
        </section>
      )}

      <section className="updates-section">

<div className="updates-header">

  <div className="updates-title">
    <h4>PG Updates</h4>

   <select
  className="update-select"
  value={selectedHostelId || "all"}
  onChange={(e) => setSelectedHostelId(e.target.value)}
>

  <option value="all">All PGs</option>

  {pgs.map((pg) => (
    <option key={pg.hostel_id} value={pg.hostel_id}>
      {pg.hostel_name}
    </option>
  ))}

</select>
  </div>

  <button
    className="add-update-btn"
    onClick={() => setShowUpdateModal(true)}
  >
    + Add Update
  </button>

</div>

  {pgUpdates.length === 0 ? (
<div className="no-updates">
  <p>No updates yet</p>
  <span>Post announcements for your tenants here.</span>
</div>  ) : (
    pgUpdates.map((u) => (
     <div key={u.id} className="update-card">

  <div className="update-card-header">
    {selectedHostelId === "all" && (
    <span className="update-pg-name">
      {u.hostelName}
    </span>
  )}
    <h5>{u.title}</h5>

    <button
      className="delete-update"
      onClick={() => deleteUpdate(u.id)}
    >
      Delete
    </button>
  </div>

  <p>{u.message}</p>

  <small>
    {new Date(u.createdAt).toLocaleString()}
  </small>

</div>
    ))
  )}

</section>

      
<section className="complaints-section">
<div className="complaints-header">

<h4 className="section-title">Recent Complaints</h4>

<select
  className="complaint-select"
  value={selectedComplaintHostelId}
  onChange={(e) => setSelectedComplaintHostelId(e.target.value)}
>

<option value="all">All PGs</option>

{pgs.map((pg) => (
  <option key={pg.hostel_id} value={pg.hostel_id}>
    {pg.hostel_name}
  </option>
))}

</select>

</div>
  {recentComplaints.length === 0 ? (
    <p className="no-data">No complaints</p>
  ) : (
    <div className="complaints-cards-grid">
      {recentComplaints.map((complaint) => (
        <div className="complaint-card" key={complaint.id}>

          <div className="complaint-icon">
            <FaUser />
          </div>

          <div className="complaint-content">

            <div className="complaint-header">
  <div className="complaint-user">
    <h5>{complaint.tenantName}</h5>

    {/* ⭐ Hostel Name */}
    <small className="complaint-hostel">
      {complaint.hostelName}
    </small>
  </div>

  <span
  className={`status-badge ${
    complaint.response ? "resolved" : "pending"
  }`}
>
  {complaint.response ? "Resolved" : "Pending"}
</span>
</div>

            <p className="complaint-message">
              {complaint.complaint}

            </p>

            <div className="complaint-actions">

  {!complaint.response && (
    <button
      className="reply-btn"
      onClick={() => openReplyModal(complaint.id)}
    >
      Reply
    </button>
  )}

</div>

            {/* {complaint.response && (
              <p className="complaint-response">
                <strong>Response:</strong> {complaint.response}
              </p>
            )} */}

         

{complaint.response && (
  <p className="complaint-response">
    <strong> Reply:</strong> {complaint.response}
  </p>
)}

          </div>

        </div>
      ))}
    </div>
  )}
</section>
{showReplyModal && (
  <div className="complaint-modal-overlay">
    <div className="complaint-modal-box">

      <h3>Reply to Complaint</h3>

      <textarea
        className="complaint-textarea"
        placeholder="Write your response..."
        value={replyText}
        onChange={(e)=>setReplyText(e.target.value)}
      />

      <div className="complaint-modal-actions">
        <button onClick={closeReplyModal}>
          Cancel
        </button>

        <button onClick={submitReply}>
          Submit
        </button>
      </div>

    </div>
  </div>
)}

{showUpdateModal && (
  <div className="update-modal-overlay">
    <div className="update-modal-box">

      <h3>Add PG Update</h3>

      <input
        className="update-input"
        placeholder="Update title"
        value={updateTitle}
        onChange={(e) => setUpdateTitle(e.target.value)}
      />

      <textarea
        className="update-textarea"
        placeholder="Write update message..."
        value={updateMessage}
        onChange={(e) => setUpdateMessage(e.target.value)}
      />

      <div className="update-modal-actions">
        <button onClick={() => setShowUpdateModal(false)}>
          Cancel
        </button>

        <button onClick={addUpdate}>
          Post Update
        </button>
      </div>

    </div>
  </div>
)}

      {/* ================= RECENT REVIEWS ================= */}
     <section className="reviews-section">
  <h4 className="section-title">Recent Reviews</h4>

  {recentReviews.length === 0 ? (
    <p className="no-data">No reviews yet</p>
  ) : (
    <div className="reviews-cards-grid">

      {recentReviews.map((review) => (
        <div className="review-card" key={review.id}>

          <div className="review-top">

            <div className="review-user">
              <div className="review-avatar">
                <FaUser />
              </div>

              <div>
                <h5>{review.reviewer}</h5>
                <small className="review-pg">
                  {review.pgName}
                </small>
              </div>
            </div>

            <div className="review-rating">
              {renderStars(review.rating)}
              <span className="rating-number">
                {review.rating.toFixed(1)}
              </span>
            </div>

          </div>

          <p className="review-text">
            {review.message}
          </p>

        </div>
      ))}

    </div>
  )}
</section>
    </div>
  );
};

export default Dashboard;