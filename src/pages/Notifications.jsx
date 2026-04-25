// import React, { useEffect, useState } from "react";
// import api from "../api";
// import "./Notifications.css";

// const Notifications = ({ user }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showReplyModal, setShowReplyModal] = useState(false);
// const [selectedComplaintId, setSelectedComplaintId] = useState(null);
// const [replyText, setReplyText] = useState("");

//   const handleApprove = async (memberId) => {
//   try {
//     await api.put(
//       `/members/approve-vacate?memberId=${memberId}`,
//       {},
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     alert("Vacate approved successfully");

//     // Refresh notifications
//     const res = await api.get("/web/notifications", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//    setNotifications((prev) =>
//   prev.map((n) =>
//     n.bookingId === memberId
//       ? { ...n, status: "APPROVED" }
//       : n
//   )
// );

//   } catch (err) {
//     console.error(err);
//     alert("Error approving vacate");
//   }
// };
//   const token = localStorage.getItem("hlopgToken");

//   const openReplyModal = (complaintId) => {
//   setSelectedComplaintId(complaintId);
//   setShowReplyModal(true);
// };

// const closeReplyModal = () => {
//   setShowReplyModal(false);
//   setSelectedComplaintId(null);
//   setReplyText("");
// };

// const handleBooking = async (id, action) => {
//   try {
//     await api.put(
//       `/booking/handle-request?requestId=${id.replace("BR-", "")}&action=${action}`,
//       {},
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     alert(`Booking ${action}`);

//     // refresh
//     const res = await api.get("/web/notifications", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (res.data.success) {
//       setNotifications(res.data.data);
//     }

//   } catch (err) {
//     console.error(err);
//     alert("Action failed");
//   }
// };

// const submitReply = async () => {
//   try {

//     if (!replyText.trim()) {
//       alert("Response cannot be empty");
//       return;
//     }

//     await api.post(
//       "/complaints/reply",
//       {
//         complaint_id: selectedComplaintId,
//         response: replyText,
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     alert("Reply submitted successfully");

//     closeReplyModal();

//   } catch (err) {
//     console.error(err);
//     alert("Reply failed");
//   }
// };

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//       const res = await api.get("/web/notifications", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.data.success) {
//           setNotifications(res.data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, [token]);

//   if (loading) return <p>Loading notifications...</p>;

//   return (
//     <div className="notifications-page">
//       <h2>All Notifications</h2>

//     {notifications
// .filter(
//   (n) =>
//     !(
//       user.role === "OWNER" &&
//       ["vacate_approved", "booking_accepted"].includes(n.type)
//     )
// )  .map((n) => (
//   <div key={n.id} className="notification-card">


//     {/* 🛠 COMPLAINT NOTIFICATION */}
// {n.type === "complaint" && (
//   <>
//     <p>
//       ⚠️ <strong>{n.userName}</strong> submitted complaint in{" "}
//       <strong>{n.hostelName}</strong>
//     </p>

//     <p>📝 {n.message}</p>

//     <button
//       className="reply-btn"
//       onClick={() => openReplyModal(n.bookingId)}
//     >
//       Reply
//     </button>
//   </>
// )}

//  {n.type === "booking_request" && (
//   <>
//     <p>
//       <strong>{n.userName}</strong> booked{" "}
//       <strong>{n.hostelName}</strong>
//     </p>

//     <p>📅 Joining Date: {n.joiningDate}</p>
//     <p>📞 {n.userPhone}</p>
//     <p>🛏 {n.sharingType} Sharing</p>

//     {n.status === "ACCEPTED" ? (
//       <span className="approved-label">✅ Accepted</span>
//     ) : n.status === "REJECTED" ? (
//       <span className="rejected-label">❌ Rejected</span>
//     ) : (
//       <>
//         <button onClick={() => handleBooking(n.bookingId, "ACCEPT")}>
//           Accept
//         </button>

//         <button onClick={() => handleBooking(n.bookingId, "REJECT")}>
//           No Vacancy
//         </button>
//       </>
//     )}
//   </>
// )}


//      {/* ❌ STAY REJECTED */}
//     {n.type === "stay_rejected" && (
//       <>
//         <p>
//           ❌ <strong>{n.userName}</strong> rejected stay at{" "}
//           <strong>{n.hostelName}</strong>
//         </p>
//         <p>📝 {n.message}</p>
//       </>
//     )}

//    {n.type === "existing_member" && (
//   <>
//     <p>
//       👤 <strong>{n.userName}</strong> joined{" "}
//       <strong>{n.hostelName}</strong>
//     </p>
//     <p>📞 {n.userPhone}</p>
//     <p>🛏 {n.sharingType} Sharing</p>
//     <p>📅 Joining Date: {n.joiningDate}</p>
//   </>
// )}

//     {/* 🚪 VACATE REQUEST NOTIFICATION */}
//    {n.type === "vacate_request" && (
//   <>
//     <p>
//       <strong>{n.userName}</strong> requested to vacate{" "}
//       <strong>{n.hostelName}</strong>
//     </p>

//     <p>📅 Requested Date: {n.message?.split("on ")[1]}</p>
//     <p>📞 {n.userPhone}</p>

//     {/* ✅ STATUS BASED UI */}
//     {n.status === "APPROVED" ? (
//       <span className="approved-label">✅ Vacate Approved</span>
//     ) : n.status === "REJECTED" ? (
//       <span className="rejected-label">❌ Vacate Rejected</span>
//     ) : (
//       <button
//         className="approve-btn"
//         onClick={() => handleApprove(n.bookingId)}
//       >
//         Approve Vacate
//       </button>
//     )}
//   </>
// )}
 
//     <small>
//       {new Date(n.createdAt).toLocaleString()}
//     </small>
//   </div>
// ))}


// {showReplyModal && (
//   <div className="complaint-modal-overlay">
//     <div className="complaint-modal-box">

//       <h3>Reply to Complaint</h3>

//       <textarea
//         placeholder="Write your response..."
//         value={replyText}
//         onChange={(e)=>setReplyText(e.target.value)}
//       />

//       <div className="complaint-modal-actions">
//         <button onClick={closeReplyModal}>
//           Cancel
//         </button>

//         <button onClick={submitReply}>
//           Submit
//         </button>
//       </div>

//     </div>
//   </div>
// )}


//     </div>
//   );
// };





// export default Notifications;



import React, { useEffect, useState } from "react";
import api from "../api";
import "./Notifications.css";

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const token = localStorage.getItem("hlopgToken");

  // Approve vacate request
  const handleApprove = async (memberId) => {
    try {
      await api.put(
        `/members/approve-vacate?memberId=${memberId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Vacate approved successfully");

      // Refresh notifications from backend
      const res = await api.get("/web/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setNotifications(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error approving vacate");
    }
  };

  // Handle booking requests
  const handleBooking = async (id, action) => {
    try {
      await api.put(
        `/booking/handle-request?requestId=${id.replace("BR-", "")}&action=${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Booking ${action}`);

      // Refresh notifications
      const res = await api.get("/web/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setNotifications(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  // Open reply modal for complaint
  const openReplyModal = (complaintId) => {
    setSelectedComplaintId(complaintId);
    setShowReplyModal(true);
  };

  const closeReplyModal = () => {
    setShowReplyModal(false);
    setSelectedComplaintId(null);
    setReplyText("");
  };

  // Submit reply to complaint
  const submitReply = async () => {
    try {
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Reply submitted successfully");
      closeReplyModal();

      // Refresh notifications
      const res = await api.get("/web/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setNotifications(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Reply failed");
    }
  };

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/web/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) setNotifications(res.data.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="notifications-page">
      <h2>All Notifications</h2>

      {notifications.length === 0 && <p>No notifications yet.</p>}

      {notifications
        .filter(
          (n) =>
            !(
              user.role === "OWNER" &&
              ["booking_accepted"].includes(n.type)
            )
        )
        .map((n) => (
          <div key={n.id || n.bookingId} className="notification-card">
            {/* 🛠 COMPLAINT NOTIFICATION */}
            {n.type === "complaint" && (
              <>
                <p>
                  ⚠️ <strong>{n.userName}</strong> submitted complaint in{" "}
                  <strong>{n.hostelName}</strong>
                </p>

                <p>📝 {n.message}</p>

                <button
                  className="reply-btn"
                  onClick={() => openReplyModal(n.id)} // Use complaint ID, not bookingId
                >
                  Reply
                </button>
              </>
            )}


            

            {/* BOOKING REQUEST */}
            {n.type === "booking_request" && (
              <>
                <p>
                  <strong>{n.userName}</strong> booked{" "}
                  <strong>{n.hostelName}</strong>
                </p>

                <p>📅 Joining Date: {n.joiningDate}</p>
                <p>📞 {n.userPhone}</p>
                <p>🛏 {n.sharingType} Sharing</p>

               {/* 🚪 VACATE REQUEST NOTIFICATION */}
{n.type === "vacate_request" && (
  <>
    <p>
      <strong>{n.userName}</strong> requested to vacate{" "}
      <strong>{n.hostelName}</strong>
    </p>

    <p>📅 Requested Date: {n.requestedDate || n.message?.split("on ")[1]}</p>
    <p>📞 {n.userPhone}</p>

    {/* Show approved or rejected label if status exists */}
    {n.status === "VACATE_APPROVED" && (
      <span className="approved-label">✅ Vacate Approved</span>
    )}
    {n.status === "VACATE_REJECTED" && (
      <span className="rejected-label">❌ Vacate Rejected</span>
    )}
    {!["VACATE_APPROVED", "VACATE_REJECTED"].includes(n.status) && (
      <span className="pending-label">⏳ Pending Approval</span>
    )}
  </>
)}
              </>
            )}

            {/* STAY REJECTED */}
            {n.type === "stay_rejected" && (
              <>
                <p>
                  ❌ <strong>{n.userName}</strong> rejected stay at{" "}
                  <strong>{n.hostelName}</strong>
                </p>
                <p>📝 {n.message}</p>
              </>
            )}

            {/* EXISTING MEMBER */}
            {n.type === "existing_member" && (
              <>
                <p>
                  👤 <strong>{n.userName}</strong> joined{" "}
                  <strong>{n.hostelName}</strong>
                </p>
                <p>📞 {n.userPhone}</p>
                <p>🛏 {n.sharingType} Sharing</p>
                <p>📅 Joining Date: {n.joiningDate}</p>
              </>
            )}

            {/* VACATE NOTIFICATIONS */}
{["vacate_request", "vacate_approved", "vacate_rejected"].includes(n.type) && (
  <div>
    {n.type === "vacate_request" && (
      <>
        <p>
          <strong>{n.userName}</strong> requested to vacate{" "}
          <strong>{n.hostelName}</strong>
        </p>
        <p>📅 Requested Date: {n.requestedDate || n.message?.split("on ")[1]}</p>
        <p>📞 {n.userPhone}</p>

        <button
          className="approve-btn"
          onClick={() => handleApprove(n.bookingId)}
        >
          Approve Vacate
        </button>
      </>
    )}

    {n.type === "vacate_approved" && (
      <>
        <p>
          ✅ {n.userName} requst for vacate <strong>{n.hostelName} hostel</strong> has been approved
        </p>
        <p>📅 {new Date(n.createdAt).toLocaleDateString()}</p>
      </>
    )}

    {n.type === "vacate_rejected" && (
      <>
        <p>
          ❌ {n.userName} requst for vacate request for <strong>{n.hostelName} hostel</strong> has been rejected
        </p>
        <p>📅 {new Date(n.createdAt).toLocaleDateString()}</p>
      </>
    )}
  </div>
)}

            {/* VACATE REQUEST */}
            {n.type === "vacate_request" && (
              <>
                <p>
                  <strong>{n.userName}</strong> requested to vacate{" "}
                  <strong>{n.hostelName}</strong>
                </p>

                <p>📅 Requested Date: {n.requestedDate || n.message?.split("on ")[1]}</p>
                <p>📞 {n.userPhone}</p>

                {n.status === "APPROVED" ? (
                  <span className="approved-label">✅ Vacate Approved</span>
                ) : n.status === "REJECTED" ? (
                  <span className="rejected-label">❌ Vacate Rejected</span>
                ) : (
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(n.bookingId)}
                  >
                    Approve Vacate
                  </button>
                )}
              </>
            )}

            <small>{new Date(n.createdAt).toLocaleString()}</small>
          </div>
        ))}

      {/* REPLY MODAL */}
      {showReplyModal && (
        <div className="complaint-modal-overlay">
          <div className="complaint-modal-box">
            <h3>Reply to Complaint</h3>
            <textarea
              placeholder="Write your response..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="complaint-modal-actions">
              <button onClick={closeReplyModal}>Cancel</button>
              <button onClick={submitReply}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;