import React from "react";
import { FaHeart, FaStar, FaHome } from "react-icons/fa";
import defaultPGImg from "../assets/pg1.jpg";
import "./HostelCard.css";
function HostelCard({
  pg,
  isSubscribed,
  likedPgIds,
  toggleLike,
  onClick
}) {
  const typeMap = {
  women: "female",
  female: "female",
  mens: "mens",
  men: "mens",
  "co-living": "co-living",
};
const typeClass = typeMap[pg.pg_type?.toLowerCase()] || "";

  return (
    <div className="home-pg-card fixed-width-card">
      <div className="pg-card-click" onClick={() => onClick(pg)}>
        
        {/* IMAGE */}
        <div className="pg-image">
          <img
            src={pg.img}
            alt={pg.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultPGImg;
            }}
          />

          {/* ❤️ LIKE */}
          <FaHeart
            className={`wishlists ${
              likedPgIds.includes(pg.id) ? "liked" : "unliked"
            }`}
            onClick={(e) => toggleLike(pg, e)}
          />
        </div>

        {/* DETAILS */}
        <div className="pg-details new-details">
          
          {/* HEADER */}
          <div className="pg-header new-header">
            <h3 className="pg-name new-name">{pg.name}</h3>

            <div className={`pg-rating ${!isSubscribed ? "blurred" : ""}`}>
              <FaStar className="star" />
              <span>{Number(pg.rating).toFixed(1)}</span>
            </div>
          </div>

          {/* LOCATION */}
          <p className={`pg-location ${!isSubscribed ? "blurred" : ""}`}>
            {pg.location}, {pg.city || ""}
          </p>

          {/* TYPE */}
          {pg.pg_type && (
            <div className={`pg-type-badge ${typeClass}`}>
              <FaHome />
              <span>{pg.pg_type} PG</span>
            </div>
          )}

          {/* FACILITIES */}
          <div className="facilities-section">
            <h4 className="facilities-title">Facilities:</h4>

            <div className={`facilities-grid ${!isSubscribed ? "blurred" : ""}`}>
              {pg.facilities.map((facility, i) => (
                <div key={i} className="facility-item">
                  <span className="facility-icon">
                    {facility.icon}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="pricecard">
            <span className="price-label">
              Starts From:{" "}
              <span className={`${!isSubscribed ? "blurred" : ""}`}>
                {pg.price}
              </span>{" "}
              /month
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HostelCard;