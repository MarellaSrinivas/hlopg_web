import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./AdminUsers.css";
import api from "../../api";


const USERS_PER_PAGE = 10;

const Owner = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "MALE",
    userType: "OWNER", // 🔥 Important
  });

  useEffect(() => {
    fetchOwners();
  }, []);

  

  const fetchOwners = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await api.get(
        "/admin/owners",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(response.data);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 🔍 SEARCH + FILTER LOGIC
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
    }

    const now = new Date();

    // TODAY
    if (filterType === "TODAY") {
      filtered = filtered.filter((user) => {
        const createdDate = new Date(user.createdAt);
        return (
          createdDate.getDate() === now.getDate() &&
          createdDate.getMonth() === now.getMonth() &&
          createdDate.getFullYear() === now.getFullYear()
        );
      });
    }

    // WEEK
    if (filterType === "WEEK") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);

      filtered = filtered.filter(
        (user) => new Date(user.createdAt) >= oneWeekAgo
      );
    }

    // MONTH
    if (filterType === "MONTH") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);

      filtered = filtered.filter(
        (user) => new Date(user.createdAt) >= oneMonthAgo
      );
    }

    return filtered;
  }, [users, searchTerm, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  // ➕ Create Owner
  const handleAddOwner = async () => {
    try {
      const token = localStorage.getItem("adminToken");

     
    await axios.post(
      "https://api.hlopg.com/api/admin/owners",
      newUser,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

      alert("Owner Created Successfully");
      setShowModal(false);
      fetchOwners();
    } catch (error) {
      console.error(error);
      alert("Failed to create owner");
    }
  };

  return (
    <div className="admin-users-container">
      <div className="users-header">
        <h2>Registered Owners</h2>
        <button
          className="add-user-btn"
          onClick={() => setShowModal(true)}
        >
          Add Owner Manually
        </button>
      </div>

      {/* Search + Filter */}
      <div className="users-controls">
        <input
          type="text"
          placeholder="Search owners..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="adminsearch-input"
        />

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="ALL">All</option>
          <option value="TODAY">Today</option>
          <option value="WEEK">This Week</option>
          <option value="MONTH">This Month</option>
        </select>
      </div>

      <div className="users-count">
        Total Owners: <strong>{filteredUsers.length}</strong>
      </div>

      {/* Table */}
      <div className="users-table">
        <div className="table-head">
          <div>S.NO</div>
          <div>Name</div>
          <div>Email</div>
          <div>Number</div>
        </div>

        {currentUsers.map((user, index) => (
          <div className="table-row" key={user.id}>
            <div>{indexOfFirstUser + index + 1}</div>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{user.phone}</div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Owner</h3>

            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            <select
              value={newUser.gender}
              onChange={(e) =>
                setNewUser({ ...newUser, gender: e.target.value })
              }
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>

            <div className="modal-buttons">
              <button onClick={handleAddOwner}>Create</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Owner;
