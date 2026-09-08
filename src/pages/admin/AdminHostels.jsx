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


  const handleHostelAction = async (hostelId, action) => {
  try {
    const token = localStorage.getItem("adminToken");

    const res = await api.put(
      `/admin/hostels/${hostelId}/${action}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

    // Refresh hostel list
    fetchHostels();

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Failed to update hostel status"
    );
  }
};
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
  <div>Hostel ID</div>
  <div>Hostel Name</div>
  <div>City</div>
  <div>pgType</div>
  <div>Status</div>
  <div>Actions</div>
 
        </div>

       {currentHostels.map((h) => (
  <div className="hostels-row" key={h.hostelId}>

    <div>{h.hostelId}</div>

    <div>{h.hostelName}</div>

    <div>{h.city}</div>

    <div className="owner-col">
      {h.pgType || "N/A"}
    </div>

    {/* STATUS */}
    <div className="owner-col">
      {h.status || "N/A"}
    </div>

    {/* ACTIONS */}
    <div className="hostel-actions">

      {/* PENDING */}
      {h.status === "PENDING" && (
        <>
          <button
            className="approve-btn"
            onClick={() =>
              handleHostelAction(h.hostelId, "approve")
            }
          >
            Approve
          </button>

          <button
            className="reject-btn"
            onClick={() => {
              if (
                window.confirm(
                  `Reject hostel "${h.hostelName}"?`
                )
              ) {
                handleHostelAction(h.hostelId, "reject");
              }
            }}
          >
            Reject
          </button>
        </>
      )}

      {/* ACTIVE */}
      {h.status === "ACTIVE" && (
        <>
          <button
            className="deactivate-btn"
            onClick={() => {
              if (
                window.confirm(
                  `Deactivate hostel "${h.hostelName}"?`
                )
              ) {
                handleHostelAction(
                  h.hostelId,
                  "deactivate"
                );
              }
            }}
          >
            Deactivate
          </button>

          <button
            className="delete-btn"
            onClick={() => {
              if (
                window.confirm(
                  `Delete hostel "${h.hostelName}" permanently from active listings?`
                )
              ) {
                handleHostelAction(
                  h.hostelId,
                  "delete"
                );
              }
            }}
          >
            Delete
          </button>
        </>
      )}

      {/* DEACTIVATED */}
      {h.status === "DEACTIVATED" && (
        <button
          className="activate-btn"
          onClick={() =>
            handleHostelAction(
              h.hostelId,
              "activate"
            )
          }
        >
          Activate
        </button>
      )}

      {/* REJECTED */}
      {h.status === "REJECTED" && (
        <button
          className="approve-btn"
          onClick={() =>
            handleHostelAction(
              h.hostelId,
              "approve"
            )
          }
        >
          Approve
        </button>
      )}

      {/* DELETED */}
      {h.status === "DELETED_BY_ADMIN" && (
        <span className="no-action">
          Deleted
        </span>
      )}

    </div>

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