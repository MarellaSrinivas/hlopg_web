import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaHeart,
  FaStar,
  FaShower,
  FaWifi,
  FaParking,
  FaBed,
  FaUtensils,
  FaBroom,
  FaUserFriends,
  FaHome,
  FaSnowflake,
  FaTv,
  FaDumbbell,
  FaFan,
  FaLightbulb,
  FaChair,
} from "react-icons/fa";

import Header from "../../components/Header";
import api from "../../api";
import "./CityHostels.css";

import hyderabadBg from "../../assets/hyderabad.png";
import chennaiBg from "../../assets/chennai.png";
import bangaloreBg from "../../assets/bangalore.png";
import mumbaiBg from "../../assets/mumbai.png";

const cityImages = {
  hyderabad: hyderabadBg,
  chennai: chennaiBg,
  bangalore: bangaloreBg,
  mumbai: mumbaiBg,
};

// ✅ Backend Base URL
const BASE_URL = "https://hlopg.com"; 

// ✅ Fixed Image URL Builder
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/300x200?text=Hostel";

  if (imagePath.startsWith("http")) return imagePath;

  if (imagePath.startsWith("/uploads")) {
    return `${BASE_URL}${imagePath}`;
  }

  return `${BASE_URL}/uploads/${imagePath}`;
};

const CityHostels = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ area: "All", pg_type: "All" });

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setLoading(true);

        console.log("Fetching hostels for city:", cityName);

        const res = await api.get(`/hostel/gethostels?city=${cityName}`);

        console.log(`${cityName} hostels response:`, res.data);

        if (res.data.success && Array.isArray(res.data.hostels)) {
          const mappedHostels = res.data.hostels.map((h) => {
            // ✅ Parse images properly (MAIN FIX)
            let imagesArray = [];

            try {
              if (typeof h.images === "string") {
                imagesArray = JSON.parse(h.images);
              } else if (Array.isArray(h.images)) {
                imagesArray = h.images;
              }
            } catch (err) {
              console.log("Error parsing images:", err);
              imagesArray = [];
            }

            let mainImage = "https://via.placeholder.com/300x200?text=Hostel";

            if (imagesArray.length > 0) {
              mainImage = getFullImageUrl(imagesArray[0]);
            } else if (h.img) {
              mainImage = getFullImageUrl(h.img);
            }

            // ✅ Parse facilities
            let facilities = {};
            try {
              facilities =
                typeof h.facilities === "string"
                  ? JSON.parse(h.facilities)
                  : h.facilities || {};
            } catch {
              facilities = {};
            }

            // ✅ Parse sharing
            let sharing = "Not specified";
            try {
              const sharingData =
                typeof h.sharing_data === "string"
                  ? JSON.parse(h.sharing_data)
                  : h.sharing_data;

              if (sharingData && typeof sharingData === "object") {
                const entries = Object.entries(sharingData);

                if (entries.length > 0) {
                  sharing = entries
                    .map(([type, price]) => {
                      const typeText =
                        type === "single"
                          ? "1-Sharing"
                          : type === "double"
                          ? "2-Sharing"
                          : type === "triple"
                          ? "3-Sharing"
                          : type === "four"
                          ? "4-Sharing"
                          : type === "five"
                          ? "5-Sharing"
                          : type === "six"
                          ? "6-Sharing"
                          : `${type}-Sharing`;

                      return `${typeText} - ₹${price}`;
                    })
                    .join(", ");
                }
              }
            } catch (e) {
              console.log("Error parsing sharing:", e);
            }

            // ✅ Gender label
            let genderLabel = "👨🏻‍💼 Men's PG";
            const genderText = (h.pg_type || "").toLowerCase();

            if (genderText.includes("women") || genderText.includes("female")) {
              genderLabel = "💁🏻‍♀️ Women's PG";
            } else if (
              genderText.includes("co") ||
              genderText.includes("mixed")
            ) {
              genderLabel = "👫 Co-Living";
            }

            // ✅ Facilities map
            const facilityMap = {
              wifi: { name: "WiFi", icon: <FaWifi /> },
              parking: { name: "Parking", icon: <FaParking /> },
              ac: { name: "AC", icon: <FaSnowflake /> },
              tv: { name: "TV", icon: <FaTv /> },
              gym: { name: "Gym", icon: <FaDumbbell /> },
              geyser: { name: "Hot Water", icon: <FaShower /> },
              fan: { name: "Fan", icon: <FaFan /> },
              bed: { name: "Bed", icon: <FaBed /> },
              lights: { name: "Lights", icon: <FaLightbulb /> },
              cupboard: { name: "Cupboard", icon: <FaChair /> },
              food: { name: "Food", icon: <FaUtensils /> },
              water: { name: "24/7 Water", icon: <FaShower /> },
              clean: { name: "Cleaning", icon: <FaBroom /> },
            };

            const facilitiesList = [];
            Object.entries(facilities).forEach(([key, value]) => {
              if (value && facilityMap[key]) {
                facilitiesList.push(facilityMap[key]);
              }
            });

            if (facilitiesList.length === 0) {
              facilitiesList.push(
                { name: "Beds", icon: <FaBed /> },
                { name: "Food", icon: <FaUtensils /> },
                { name: "Clean", icon: <FaBroom /> },
                { name: "Wash", icon: <FaShower /> }
              );
            }

            return {
              id: h.hostel_id || h.id,
              img: mainImage,
              name: h.hostel_name || h.name || "Unnamed Hostel",
              area: h.area || "Unknown Area",
              location: h.area || h.city || h.address || "Unknown Location",
              price: h.price
                ? `₹${h.price}`
                : h.rent
                ? `₹${h.rent}`
                : "₹5000",
              rating: h.rating || 4.5,
              facilities: facilitiesList.slice(0, 6),
              sharing: sharing,
              pg_type: genderText || "hostel",
              genderLabel: genderLabel,
              city: h.city,
              description: h.description || "",
            };
          });

          console.log(`Mapped ${mappedHostels.length} hostels for ${cityName}`);
          setHostels(mappedHostels);
        } else {
          console.log("No hostels found or API response incorrect");
          setHostels([]);
        }
      } catch (err) {
        console.error(`Error fetching ${cityName} hostels:`, err);
        setHostels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, [cityName]);

  const filterOptions = {
    area: ["All", ...new Set(hostels.map((pg) => pg.area).filter(Boolean))],
    pg_type: ["All", ...new Set(hostels.map((pg) => pg.pg_type).filter(Boolean))],
  };

  const filteredPGs = hostels.filter((pg) =>
    Object.entries(filters).every(([key, value]) =>
      value === "All" ? true : pg[key] === value
    )
  );

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const cityTitle =
    cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();

  if (loading) {
    return (
      <div className="city-page">
        <Header />
        <div className="loading">Loading hostels in {cityTitle}...</div>
      </div>
    );
  }

  return (
    <div className="city-page">
      <Header />

      <div
        className="city-hero"
        style={{
          backgroundImage: `url(${cityImages[cityName.toLowerCase()] || hyderabadBg})`,
        }}
      >
        <div className="city-overlay">
          <h1>Hostels in {cityTitle}</h1>
          <p>
            Explore the best PGs in {cityTitle} for a comfortable and convenient
            stay.
          </p>
        </div>
      </div>

      {hostels.length > 0 && (
        <div className="area-gender-filter">
          {Object.keys(filterOptions).map((key, idx) => (
            <div key={idx} className="filter-item">
              <label>{key === "pg_type" ? "Gender" : "Area"}:</label>
              <select
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
              >
                {filterOptions[key].map((opt, id) => (
                  <option key={id} value={opt}>
                    {opt === "All"
                      ? "All"
                      : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {filteredPGs.length === 0 ? (
        <p className="no-results">
          {hostels.length === 0
            ? `No hostels found in ${cityTitle}`
            : "No PGs found with selected filters"}
        </p>
      ) : (
        <div className="pg-grid">
          {filteredPGs.map((pg) => (
            <div
              key={pg.id}
              className="city-pg-card"
              onClick={() => navigate(`/hostel/${pg.id}`)}
            >
              <div className="city-pg-image">
                <div className="image-container">
                  <img
                    src={pg.img}
                    alt={pg.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=Hostel";
                    }}
                  />
                </div>
                <FaHeart className="city-wishlist" />
              </div>

              <div className="city-pg-info">
                <div className="pg-header">
                  <h3 className="pg-name">{pg.name}</h3>
                  <div className="pg-rating">
                    <FaStar className="star" />
                    <span>{pg.rating}</span>
                  </div>
                </div>

                <p className="pg-location">{pg.location}</p>

                <div className="pg-type-badges">
                  <FaHome />
                  <span>{pg.genderLabel}</span>
                </div>

                <div className="sharing-price-section">
                  <div className="sharing-info">
                    <FaUserFriends />
                    <span className="sharing-text">{pg.sharing}</span>
                  </div>
                </div>

                <div className="facilities-section">
                  <div className="facilities-grid">
                    {pg.facilities.map((facility, index) => (
                      <div key={index} className="facility-item">
                        <span className="facility-icon">
                          {facility.icon || <FaHome />}
                        </span>
                        <span className="facility-name">{facility.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityHostels;
