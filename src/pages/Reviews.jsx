import React, { useState, useEffect } from "react";
import api from "../api";
import "./Reviews.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const renderStars = (rating = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} color="#FFD700" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" color="#FFD700" />);
  }

  while (stars.length < 5) {
    stars.push(<FaRegStar key={`empty-${stars.length}`} color="#FFD700" />);
  }

  return <div className="stars">{stars}</div>;
};

const Reviews = ({ user }) => {

  const [pgs, setPGs] = useState([]);
  const [selectedPG, setSelectedPG] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  /* ================= FETCH OWNER PGS ================= */

  useEffect(() => {

  const fetchPGs = async () => {

    console.log("USER DATA:", user);

    try {

      const token = localStorage.getItem("hlopgToken");

      const res = await api.get("/hostel/owner/pgs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("PG API RESPONSE:", res.data);

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

  fetchPGs();   // 🚀 always call API

}, []);
  /* ================= FETCH REVIEWS ================= */

  useEffect(() => {

    const fetchReviews = async () => {

      if (!selectedPG) return;

      try {

        setReviewLoading(true);

        const token = localStorage.getItem("hlopgToken");

        const res = await api.get(
          `/reviews/hostel/${selectedPG.hostel_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          setReviews(res.data.reviews || []);
        } else {
          setReviews([]);
        }

      } catch (err) {

        console.error("Error fetching reviews", err);
        setReviews([]);

      } finally {

        setReviewLoading(false);

      }

    };

    fetchReviews();

  }, [selectedPG]);

  if (loading) {
    return <p>Loading PGs...</p>;
  }

  return (

    <div className="reviews-container">

      <div className="reviews-top-bar">

        <h2>Customer Reviews</h2>
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

      {reviewLoading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (

        <p>No reviews yet for this PG.</p>

      ) : (

        <div className="reviews-grid">

          {reviews.map((r) => (

            <div key={r.id} className="review-card">

              <div className="review-header">

                <img
                  src={
                    r.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="user"
                  className="avatar"
                />

                <div className="reviewer-info">
                  <h4>{r.name || "Anonymous"}</h4>
                 </div>

              </div>

              <p className="review-text">{r.comment}</p>

              {renderStars(r.rating)}

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default Reviews;