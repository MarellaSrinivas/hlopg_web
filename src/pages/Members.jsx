import React, { useState, useEffect } from "react";
import api from "../api";
import "./Members.css";


const Members = ({ user }) => {
  const [pgs, setPgs] = useState([]);
  const [selectedPG, setSelectedPG] = useState(null);
  const [monthType, setMonthType] = useState("this");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
const [selectedVacateMember, setSelectedVacateMember] = useState(null);
const [vacateDate, setVacateDate] = useState("");
  const [showModal, setShowModal] = useState(false);
const [newMember, setNewMember] = useState({
  phone: "",
  name: "",
  roomNumber: "",
  sharingType: "",
  joiningDate: "",
});

const [userFound, setUserFound] = useState(false);
const [checkingUser, setCheckingUser] = useState(false);
const [phoneError, setPhoneError] = useState("");

const handleAddMember = async (e) => {
  e.preventDefault();

  if (!userFound) {
    alert("User not registered");
    return;
  }

  try {
    const res = await api.post(
      "/members/add-by-phone",
      null,
      {
        params: {
          ownerId: user.owner_id,
          phone: newMember.phone,
          hostelId: selectedPG.hostel_id,
          roomNumber: newMember.roomNumber,
          sharingType: newMember.sharingType,
          joiningDate: newMember.joiningDate,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.success) {
      alert("Member Added Successfully");
      fetchMembers();
      setShowModal(false);

      // reset form
      setNewMember({
        phone: "",
        name: "",
        roomNumber: "",
        sharingType: "",
        joiningDate: "",
      });

      setUserFound(false);
      setPhoneError("");
    }
  } catch (err) {
    alert(err.response?.data?.message || "Error adding member");
  }
};
  const token = localStorage.getItem("hlopgToken");

 useEffect(() => {
  const fetchPGs = async () => {
    try {
      const token = localStorage.getItem("hlopgToken");

      const res = await api.get("/hostel/owner/pgs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPgs(res.data.data);

        if (res.data.data.length > 0) {
          setSelectedPG(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching PGs", err);
    }
  };

  if (user?.owner_id) {
    fetchPGs();
  }
}, [user]);


const checkUserByPhone = async (phone) => {
  if (phone.length !== 10) return;

  try {
    setCheckingUser(true);

    const res = await api.get(
      `/users/check-by-phone/${phone}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.exists) {
      setNewMember((prev) => ({
        ...prev,
        name: res.data.name || "",
      }));

      setUserFound(true);
      setPhoneError("");
    } else {
      setUserFound(false);
      setPhoneError("User not registered. Ask them to register.");
      setNewMember((prev) => ({ ...prev, name: "" }));
    }

  } catch (err) {
    setUserFound(false);
    setPhoneError("Error checking user");
    setNewMember((prev) => ({ ...prev, name: "" }));
  } finally {
    setCheckingUser(false);
  }
};
  // ✅ Fetch members when PG or month changes
  useEffect(() => {
    if (!selectedPG) return;
    fetchMembers();
  }, [selectedPG, monthType]);

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/members/owner/members", {
        params: {
          hostelId: selectedPG.hostel_id,
          monthType: monthType,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setMembers(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching members", err);
    } finally {
      setLoading(false);
    }
  };


  const handleVacate = async (memberId) => {
  const today = new Date().toISOString().split("T")[0];

  try {
    await api.put(
      "/members/update-vacate-date",
      null,
      {
        params: {
          memberId: memberId,
          vacateDate: today,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchMembers(); // refresh list
  } catch (err) {
    alert("Error updating vacate date");
  }
};

  const togglePaymentStatus = async (member) => {
  const newStatus =
    member.paymentStatus === "Paid" ? "Unpaid" : "Paid";

  try {
    await api.put(
      "/members/update-payment-status",
      null,
      {
        params: {
          memberId: member.id,
          status: newStatus,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update UI instantly
    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? { ...m, paymentStatus: newStatus }
          : m
      )
    );
  } catch (err) {
    alert("Failed to update payment status");
  }
};

const saveVacateDate = async (memberId) => {
  if (!vacateDate) {
    alert("Please select a date");
    return;
  }

  try {
    await api.put(
      "/members/update-vacate-date",
      null,
      {
        params: {
          memberId: memberId,
          vacateDate: vacateDate,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSelectedVacateMember(null);
    setVacateDate("");
    fetchMembers();
  } catch (err) {
    alert("Error updating vacate date");
  }
};
  return (

    
    <div className="pg-members-page">

      {/* 🔥 Top Bar */}
      <div className="members-top-bar">
        <h2>PG Members</h2>


       

        {/* PG Dropdown */}
        <select
          value={selectedPG?.hostel_id || ""}
          onChange={(e) => {
            const pg = pgs.find(
              (p) => p.hostel_id === Number(e.target.value)
            );
            setSelectedPG(pg);
          }}
        >
          {pgs.map((pg) => (
            <option key={pg.hostel_id} value={pg.hostel_id}>
              {pg.hostel_name}
            </option>
          ))}
        </select>

        {/* Month Filter */}
        <div className="month-filter">
          <button onClick={() => setMonthType("this")}>
            This Month
          </button>
          <button onClick={() => setMonthType("last")}>
            Last Month
          </button>
          <button onClick={() => setMonthType("previous")}>
            Previous Month
          </button>
        </div>
      </div>

       <div className="top-actions">
  <button
    className="add-member-btn"
    onClick={() => setShowModal(true)}
  >
    + Add Member
  </button>
</div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : members.length === 0 ? (
        <p>No members found</p>
      ) : (
        
       <table className="members-table">
  <thead>
    <tr>
      <th>User Name</th>
      <th>Room No</th>
      <th>Sharing</th>
      <th>Joining Date</th>
      <th>Vacate Date</th>
      <th>Payment Status</th>
    </tr>
  </thead>

  <tbody>
    {members.map((m) => (
      <tr key={m.id}>
        <td>{m.name}</td>
        <td>{m.roomNumber}</td>
        <td>{m.sharingType}</td>
        <td>{m.joiningDate}</td>

        {/* ✅ VACATE DATE COLUMN LOGIC */}
        <td>
          {/* 1️⃣ If already vacated or date set */}
          {m.vacateDate ? (
            <span className="vacate-date">
              {m.vacateDate}
            </span>
          ) : 

          /* 2️⃣ If user requested vacate */
          m.status === "VACATE_REQUESTED" ? (
            <div className="vacate-request-box">
              <span className="requested-date">
                Requested: {m.requestedVacateDate}
              </span>

              <button
                className="accept-request-btn"
                onClick={async () => {
                  try {
                    await api.put(
                      "/members/update-vacate-date",
                      null,
                      {
                        params: {
                          memberId: m.id,
                          vacateDate: m.requestedVacateDate,
                        },
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    fetchMembers();
                  } catch (err) {
                    alert("Error accepting vacate request");
                  }
                }}
              >
                Accept
              </button>
            </div>
          ) : 

          /* 3️⃣ Owner manual vacate option */
          selectedVacateMember === m.id ? (
            <div className="manual-vacate-box">
              <input
                type="date"
                value={vacateDate}
                onChange={(e) => setVacateDate(e.target.value)}
              />
              <div className="vacate-actions">
                <button
                  onClick={() => saveVacateDate(m.id)}
                  className="save-btn"
                >
                  Save
                </button>
                <button
                  onClick={() => setSelectedVacateMember(null)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="vacate-btn"
              onClick={() => setSelectedVacateMember(m.id)}
            >
              Set Vacate Date
            </button>
          )}
        </td>

        {/* ✅ PAYMENT COLUMN */}
        <td>
          <button
            className={
              m.paymentStatus === "Paid"
                ? "status-paid"
                : "status-unpaid"
            }
            onClick={() => togglePaymentStatus(m)}
          >
            {m.paymentStatus || "Unpaid"}
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      )}



      {showModal && (
  <div className="member-modal">
    <div className="modal-content">
      <h3>Add Member</h3>
      <form onSubmit={handleAddMember}>

       

<input
  type="tel"
  maxLength="10"
  pattern="[0-9]*"
  placeholder="Phone Number"
  value={newMember.phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    setNewMember({ ...newMember, phone: value });

    if (value.length === 10) {
      checkUserByPhone(value);
    }
  }}
  required
/>

{checkingUser && <p>Checking user...</p>}
{phoneError && <p style={{ color: "red" }}>{phoneError}</p>}
        

        <input
          type="text"
          placeholder="Room Number"
          value={newMember.roomNumber}
          onChange={(e) =>
            setNewMember({ ...newMember, roomNumber: e.target.value })
          }
          required
        />

{/* <input
  type="text"
  placeholder="Student Name"
  value={newMember.name}
  readOnly
/> */}
        <input
          type="text"
          placeholder="Sharing Type"
          value={newMember.sharingType}
          onChange={(e) =>
            setNewMember({ ...newMember, sharingType: e.target.value })
          }
          required
        />

        <input
          type="date"
          value={newMember.joiningDate}
          onChange={(e) =>
            setNewMember({ ...newMember, joiningDate: e.target.value })
          }
          required
        />

        <div className="modal-buttons">
          <button type="submit">Save</button>
          <button
            type="button"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default Members;
