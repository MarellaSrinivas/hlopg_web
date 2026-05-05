import React, { useEffect, useState, useMemo } from "react";
import api from "../../api";
import "./AdminHostels.css";

const HOSTELS_PER_PAGE = 10;

const AdminHostels = () => {
  const [hostels, setHostels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await api.get("/admin/hostels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHostels(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Get unique cities for dropdown
  const uniqueCities = [...new Set(hostels.map(h => h.city))];

  // ✅ FILTER + SEARCH
  const filteredHostels = useMemo(() => {
    let filtered = [...hostels];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(h =>
        h.hostelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.ownerPhone?.includes(searchTerm)
      );
    }

    // City filter
    if (cityFilter !== "ALL") {
      filtered = filtered.filter(h => h.city === cityFilter);
    }

    return filtered;
  }, [hostels, searchTerm, cityFilter]);

  // ✅ PAGINATION
  const totalPages = Math.ceil(filteredHostels.length / HOSTELS_PER_PAGE);

  const indexOfLast = currentPage * HOSTELS_PER_PAGE;
  const indexOfFirst = indexOfLast - HOSTELS_PER_PAGE;

  const currentHostels = filteredHostels.slice(indexOfFirst, indexOfLast);

  return (
    <div className="admin-hostels-container">
      <h2>Registered Hostels</h2>

      {/* 🔍 Controls */}
      <div className="hostels-controls">
        <input
          type="text"
          placeholder="Search hostel / owner / phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="hostel-search"
        />

        <select
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="hostel-filter"
        >
          <option value="ALL">All Cities</option>
          {uniqueCities.map((city, i) => (
            <option key={i} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="hostels-count">
        Total Hostels: <strong>{filteredHostels.length}</strong>
      </div>

      {/* 📋 Table */}
      <div className="hostels-table">
        <div className="hostels-head">
          <div>S.NO</div>
          <div>Hostel</div>
          <div>City</div>
          <div>Owner</div>
          <div>Phone</div>
        </div>

        {currentHostels.map((h, index) => (
          <div className="hostels-row" key={h.hostelId}>
            <div>{indexOfFirst + index + 1}</div>
            <div>{h.hostelName}</div>
            <div>{h.city}</div>
            <div className="owner-col">{h.ownerName || "N/A"}</div>
            <div className="phone-col">{h.ownerPhone || "N/A"}</div>
          </div>
        ))}
      </div>

      {/* 🔢 Pagination */}
      <div className="hostels-pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminHostels;