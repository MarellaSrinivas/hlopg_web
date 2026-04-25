// src/pages/MyBookings.jsx
import React, { useState, useEffect } from "react";
import api from "../api";
import "./MyBookings.css";

const MyBookings = ({ user }) => {
  const [pgs, setPGs] = useState([]);
  const [selectedPG, setSelectedPG] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch Owner PGs
  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");

        const res = await api.get("/hostel/owner/pgs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setPGs(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedPG(res.data.data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching PGs", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.owner_id) fetchPGs();
  }, [user]);

  // Fetch Bookings by Selected PG
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedPG) return;

      try {
        setBookingLoading(true);
        const token = localStorage.getItem("hlopgToken");

        const res = await api.get(
          `/booking/hostel/${selectedPG.hostel_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBookings(res.data || []);
      } catch (err) {
        console.error("Error fetching bookings", err);
        setBookings([]);
      } finally {
        setBookingLoading(false);
      }
    };

    fetchBookings();
  }, [selectedPG]);

  if (loading) {
    return <p>Loading PGs...</p>;
  }

  return (
    <div className="mybookings-container">
      <div className="booking-header">
        <h2>My Bookings</h2>

        <select
          value={selectedPG?.hostel_id || ""}
          onChange={(e) => {
            const pg = pgs.find(
              (p) => p.hostel_id == e.target.value
            );
            setSelectedPG(pg);
          }}
          className="pg-dropdown"
        >
          {pgs.map((pg) => (
            <option key={pg.hostel_id} value={pg.hostel_id}>
              {pg.hostel_name}
            </option>
          ))}
        </select>
      </div>

      {bookingLoading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="no-bookings">
          <h3>No Bookings Found</h3>
          <p>This hostel has no bookings yet.</p>
        </div>
      ) : (
        <div className="booking-table">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Phone</th>
                <th>Sharing Type</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.userName}</td>
                  <td>{b.userMobile}</td>
                  <td>{b.sharingType}</td>
                  <td>
                    <span className={`status ${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
