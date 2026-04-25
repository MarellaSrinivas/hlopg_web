
import React, { useState, useEffect } from "react";
import "./MyRooms.css";
import api from "../api";
import { createPortal } from "react-dom";



const MyRooms = ({ user }) => {
  const [monthType, setMonthType] = useState("this");   // ✅ ADD THIS

  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPG, setSelectedPG] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomLoading, setRoomLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
const [roomMembers, setRoomMembers] = useState([]);
const [selectedRoomNumber, setSelectedRoomNumber] = useState("");
  
  // Floor & room configuration from PG data
  const [pgConfig, setPgConfig] = useState({
    numFloors: 0,
    roomsPerFloor: 0,
    startingRoomNumber: "",
    advanceAmount: 0,
    sharingData: {}
  });

  // Fetch owner's PGs
  useEffect(() => {
    const fetchPGs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("hlopgToken");
        
        let pgsData = [];
        
        try {
          // Try the primary endpoint: /hostel/owner/pgs
          const response = await api.get(`/hostel/owner/pgs`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data && response.data.success) {
            pgsData = response.data.data || [];
          }
        } catch (error) {
          console.log("Primary endpoint failed, trying alternatives...");
          
          try {
            // Try: /owner/pg
            const response = await api.get(`/owner/pg`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            pgsData = response.data || [];
          } catch (error2) {
            console.log("Alternative endpoint also failed:", error2);
          }
        }
        
        console.log("PGs fetched:", pgsData);
        
        if (pgsData && pgsData.length > 0) {
          const formattedPGs = pgsData.map(pg => {
            // Parse sharing data
            let sharingData = {};
            if (pg.sharing_data) {
              try {
                sharingData = typeof pg.sharing_data === 'string' 
                  ? JSON.parse(pg.sharing_data) 
                  : pg.sharing_data;
              } catch (e) {
                console.log("Could not parse sharing_data");
              }
            } else if (pg.sharing) {
              try {
                sharingData = typeof pg.sharing === 'string' 
                  ? JSON.parse(pg.sharing) 
                  : pg.sharing;
              } catch (e) {
                console.log("Could not parse sharing");
              }
            }
            
            // Parse floor configuration
            let numFloors = 0;
            let roomsPerFloor = 0;
            let startingRoomNumber = "";
            let advanceAmount = 0;
            
            // Check direct fields
            if (pg.numFloors) numFloors = parseInt(pg.numFloors);
            if (pg.roomsPerFloor) roomsPerFloor = parseInt(pg.roomsPerFloor);
            if (pg.startingRoomNumber) startingRoomNumber = pg.startingRoomNumber;
            if (pg.advanceAmount) advanceAmount = parseInt(pg.advanceAmount);
            
            // Check facilities or room_config
            if (pg.facilities) {
              try {
                const facilities = typeof pg.facilities === 'string' 
                  ? JSON.parse(pg.facilities) 
                  : pg.facilities;
                if (facilities.numFloors) numFloors = parseInt(facilities.numFloors);
                if (facilities.roomsPerFloor) roomsPerFloor = parseInt(facilities.roomsPerFloor);
                if (facilities.startingRoomNumber) startingRoomNumber = facilities.startingRoomNumber;
                if (facilities.advanceAmount) advanceAmount = parseInt(facilities.advanceAmount);
              } catch (e) {
                console.log("Could not parse facilities");
              }
            }
            
            if (pg.room_config) {
              try {
                const roomConfig = typeof pg.room_config === 'string' 
                  ? JSON.parse(pg.room_config) 
                  : pg.room_config;
                if (roomConfig.numFloors) numFloors = parseInt(roomConfig.numFloors);
                if (roomConfig.roomsPerFloor) roomsPerFloor = parseInt(roomConfig.roomsPerFloor);
                if (roomConfig.startingRoomNumber) startingRoomNumber = roomConfig.startingRoomNumber;
                if (roomConfig.advanceAmount) advanceAmount = parseInt(roomConfig.advanceAmount);
              } catch (e) {
                console.log("Could not parse room_config");
              }
            }
            
            return {
              hostel_id: pg.hostel_id || pg.id || pg._id,
              hostel_name: pg.hostel_name || pg.name || "Unnamed PG",
              area: pg.area || pg.location?.area || "Unknown Area",
              city: pg.city || pg.location?.city || "Unknown City",
              state: pg.state || pg.location?.state || "",
              total_rooms: pg.total_rooms || pg.rooms_count || 0,
              occupied_rooms: pg.occupied_rooms || 0,
              vacant_rooms: pg.vacant_rooms || 0,
              img: pg.img || pg.images?.[0] || "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=PG",
              // Store configuration data
              sharing_data: sharingData,
              numFloors,
              roomsPerFloor,
              startingRoomNumber,
              advanceAmount,
              rawData: pg
            };
          });
          
          setPGs(formattedPGs);
          localStorage.setItem("hlopgOwnerPGs", JSON.stringify(formattedPGs));
          
          if (!selectedPG && formattedPGs.length > 0) {
            setSelectedPG(formattedPGs[0]);
          }
        } else {
          setPGs([]);
          localStorage.removeItem("hlopgOwnerPGs");
        }
      } catch (error) {
        console.error("Error fetching PGs:", error);
        setPGs([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.owner_id) {
      fetchPGs();
    } else {
      const cachedUser = localStorage.getItem("hlopgOwner");
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          if (parsedUser.owner_id || parsedUser.id) {
            fetchPGs();
          }
        } catch (e) {
          console.error("Error parsing cached user:", e);
        }
      }
    }
  }, [user, refreshKey]);

  // Fetch rooms AND PG configuration for selected PG
  useEffect(() => {
    const fetchRoomsAndConfig = async () => {
      if (!selectedPG) return;
      
      try {
        setRoomLoading(true);
        const token = localStorage.getItem("hlopgToken");
        
        console.log("Fetching rooms and config for PG:", selectedPG.hostel_id);
        
        let roomsData = [];
        
        // Fetch rooms
        try {
          // Try the new endpoint first: /api/hostel/rooms/pg/{hostelId}
          const response = await api.get(`/hostel/rooms/pg/${selectedPG.hostel_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Handle the response format from new endpoint
          if (response.data && response.data.data) {
            roomsData = response.data.data;
          } else if (response.data && response.data.rooms) {
            roomsData = response.data.rooms;
          } else {
            roomsData = response.data || [];
          }
        } catch (error) {
          console.log("New rooms endpoint failed, trying alternatives...");
          
          try {
            // Try: /api/hostel/{hostelId}/rooms (alternative new endpoint)
            const response = await api.get(`/hostel/${selectedPG.hostel_id}/rooms`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data && response.data.data) {
              roomsData = response.data.data;
            } else if (response.data && response.data.rooms) {
              roomsData = response.data.rooms;
            } else {
              roomsData = response.data || [];
            }
          } catch (error2) {
            console.log("Alternative endpoint failed, trying old endpoints...");
            
            try {
              // Try: /rooms/pg/${selectedPG.hostel_id} (old endpoint)
              const response = await api.get(`/rooms/pg/${selectedPG.hostel_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              roomsData = response.data || [];
            } catch (error3) {
              console.log("Old rooms endpoint failed, trying owner endpoint...");
              
              try {
                // Try: /owner/rooms/${selectedPG.hostel_id}
                const response = await api.get(`/owner/rooms/${selectedPG.hostel_id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                roomsData = response.data || [];
              } catch (error4) {
                console.log("All rooms endpoints failed, using sample data");
                roomsData = createSampleRooms();
              }
            }
          }
        }
        
        setRooms(roomsData);
        
        // Process floor/room configuration from PG data
        processPgConfiguration(selectedPG);
        
        // Group rooms by floor
        processRoomsByFloor(roomsData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        const sampleData = createSampleRooms();
        setRooms(sampleData);
        processRoomsByFloor(sampleData);
        processPgConfiguration(selectedPG);
      } finally {
        setRoomLoading(false);
      }
    };

    fetchRoomsAndConfig();
  }, [selectedPG]);


  useEffect(() => {
  if (showPopup) {
    document.body.classList.add("popup-open");
  } else {
    document.body.classList.remove("popup-open");
  }

  return () => {
    document.body.classList.remove("popup-open");
  };
}, [showPopup]);


useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      setShowPopup(false);
    }
  };

  window.addEventListener("keydown", handleEsc);

  return () => {
    window.removeEventListener("keydown", handleEsc);
  };
}, []);

  // Process PG configuration (numFloors, roomsPerFloor, etc.)
  const processPgConfiguration = (pgData) => {
    if (!pgData) return;
    
    const config = {
      numFloors: pgData.numFloors || 0,
      roomsPerFloor: pgData.roomsPerFloor || 0,
      startingRoomNumber: pgData.startingRoomNumber || "",
      advanceAmount: pgData.advanceAmount || 0,
      sharingData: pgData.sharing_data || {}
    };
    
    console.log("Processed PG config:", config);
    setPgConfig(config);
  };

  // Process rooms and group by floor
  const processRoomsByFloor = (roomsData) => {
    const floors = {};
    
    roomsData.forEach(room => {
      let floor = 1;
      if (room.room_number) {
        const firstChar = room.room_number.charAt(0);
        if (!isNaN(firstChar)) {
          floor = parseInt(firstChar);
        }
      } else if (room.floor) {
        floor = parseInt(room.floor);
      }
      
      if (floor < 1) floor = 1;
      if (floor > 10) floor = 10;
      
      if (!floors[floor]) {
        floors[floor] = [];
      }
      
      floors[floor].push({
        id: room.id || room._id || Date.now() + Math.random(),
        room_number: room.room_number || `F${floor}R${floors[floor].length + 1}`,
        floor: floor,
        sharing_type: room.sharing_type || room.sharing || "2-Sharing",
        rent: room.rent || room.price || 5000,
        status: room.status || "vacant",
        tenant_name: room.tenant_name || room.tenant?.name || null,
        tenant_phone: room.tenant_phone || room.tenant?.phone || null,
        amenities: room.amenities || ["WiFi", "Attached Bathroom"]
      });
    });
    
    // Create expected floors based on configuration
    const expectedFloors = pgConfig.numFloors || 3;
    for (let floor = 1; floor <= expectedFloors; floor++) {
      if (!floors[floor]) {
        floors[floor] = [];
      }
    }
    
    const filtered = Object.keys(floors)
      .map(floor => ({
        floor: parseInt(floor),
        rooms: floors[floor].sort((a, b) => a.room_number.localeCompare(b.room_number))
      }))
      .sort((a, b) => a.floor - b.floor);
    
    setFilteredRooms(filtered);
  };

  // Create sample room data
  const createSampleRooms = () => {
    if (!selectedPG) return [];
    
    const sampleRooms = [];
    const totalFloors = pgConfig.numFloors || 3;
    const roomsPerFloor = pgConfig.roomsPerFloor || 5;
    
    // Get sharing types and prices from PG configuration
    const sharingTypes = Object.keys(pgConfig.sharingData || {});
    const defaultSharingTypes = ["2-Sharing", "3-Sharing", "4-Sharing"];
    const availableSharingTypes = sharingTypes.length > 0 ? sharingTypes : defaultSharingTypes;
    
    for (let floor = 1; floor <= totalFloors; floor++) {
      for (let roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
        const roomId = `${selectedPG.hostel_id}_${floor}${String(roomNum).padStart(2, '0')}`;
        const roomNumber = `${floor}${String(roomNum).padStart(2, '0')}`;
        const sharingType = availableSharingTypes[(roomNum - 1) % availableSharingTypes.length];
        
        // Get rent from sharing data or use default calculation
        let rent = pgConfig.sharingData?.[sharingType] || (5000 + (floor * 500) + (roomNum * 100));
        
        sampleRooms.push({
          id: roomId,
          room_number: roomNumber,
          floor: floor,
          sharing_type: sharingType,
          rent: rent,
          status: roomNum <= 2 ? "occupied" : "vacant", // First 2 rooms occupied
          tenant_name: roomNum <= 2 ? ["John Doe", "Jane Smith"][roomNum - 1] : null,
          tenant_phone: roomNum <= 2 ? "9876543210" : null,
          amenities: ["WiFi", "Attached Bathroom", "Bed", "Wardrobe"],
          pg_id: selectedPG.hostel_id
        });
      }
    }
    
    console.log("Created sample rooms:", sampleRooms.length);
    return sampleRooms;
  };

  // Get floor name
  const getFloorName = (floor) => {
    if (floor === 1) return "1st Floor";
    if (floor === 2) return "2nd Floor";
    if (floor === 3) return "3rd Floor";
    return `${floor}th Floor`;
  };

  // Update room status
  const updateRoomStatus = async (roomId, newStatus) => {
    try {
      const updatedRooms = rooms.map(room => 
        room.id === roomId ? { ...room, status: newStatus } : room
      );
      
      setRooms(updatedRooms);
      processRoomsByFloor(updatedRooms);
      
      const token = localStorage.getItem("hlopgToken");
      
      try {
        // Try new endpoint first: /api/hostel/room/{roomId}/status
        await api.put(`/hostel/room/${roomId}/status`, 
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Status updated via new endpoint");
      } catch (error) {
        console.log("New endpoint failed, trying old endpoint...");
        // Fallback to old endpoint
        try {
          await api.put(`/rooms/${roomId}/status`, 
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Status updated via old endpoint");
        } catch (error2) {
          console.log("All endpoints failed, updating locally only");
          // Update locally even if API fails
        }
      }
      
      alert(`Room status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating room status:", error);
      alert("Failed to update room status. Please try again.");
    }
  };

  // Handle room click
//   const handleRoomClick = (room) => {
//     console.log("Room clicked:", room);
    
//     const roomInfo = `
// Room Details:
// -------------
// Room Number: ${room.room_number}
// Floor: ${getFloorName(room.floor)}
// Sharing Type: ${room.sharing_type}
// Rent: ₹${room.rent}/month
// Status: ${room.status.toUpperCase()}
// ${room.tenant_name ? `\nTenant: ${room.tenant_name}\nPhone: ${room.tenant_phone}` : 'Status: VACANT'}
// ${room.amenities ? `\nAmenities: ${Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities}` : ''}
//     `.trim();
    
//     alert(roomInfo);
//   };
useEffect(() => {
  if (showPopup && selectedRoomNumber) {

    const fetchMembersByMonth = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");

        const res = await api.get("/members/room", {
          params: {
            hostelId: selectedPG.hostel_id,
            roomNumber: selectedRoomNumber,
            monthType: monthType
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setRoomMembers(res.data.data);
        }

      } catch (error) {
        console.error("Error refetching members:", error);
      }
    };

    fetchMembersByMonth();
  }
}, [monthType]); 

const handleRoomClick = async (room) => {
  try {
    const token = localStorage.getItem("hlopgToken");

    const res = await api.get("/members/room", {
      params: {
        hostelId: selectedPG.hostel_id,
        roomNumber: room.room_number,
        monthType: monthType
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.data.success) {
      setRoomMembers(res.data.data);
      setSelectedRoomNumber(room.room_number);
      setShowPopup(true);
    }

  } catch (error) {
    console.error("Error fetching room members:", error);
  }
};


  // Refresh data
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setRoomLoading(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'vacant': return '#4CAF50'; // Green
      case 'occupied': return 'red'; // Blue
      case 'maintenance': return '#ff9800'; // Orange
      default: return '#9e9e9e'; // Grey
    }
  };

  if (loading) {
    return (
      <div className="myrooms-loading">
        <div className="spinner"></div>
        <p>Loading your PGs...</p>
      </div>
    );
  }

  if (pgs.length === 0) {
    return (
      <div className="myrooms-empty">
        <div className="empty-icon">🏠</div>
        <h3>No PGs Found</h3>
        <p>You haven't uploaded any PGs yet.</p>
        <p>Go to "Upload PG" to add your first property.</p>
        <button 
          className="go-to-upload-btn"
          onClick={() => window.location.href = "/owner-dashboard?tab=Upload PG"}
        >
          Upload PG
        </button>
      </div>
    );
  }

  const PopupModal = () => {
  if (!showPopup) return null;

  return createPortal(
    <div
      className="popup-overlay"
      onClick={() => setShowPopup(false)}
    >
      <div
        className="popup-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
  <div>
    <h3>Room {selectedRoomNumber}</h3>
    <span className="member-count">
      {roomMembers.length} Member(s)
    </span>
  </div>

  <div className="month-filter">
    <button
      className={monthType === "this" ? "active" : ""}
      onClick={() => setMonthType("this")}
    >
      This Month
    </button>
    <button
      className={monthType === "last" ? "active" : ""}
      onClick={() => setMonthType("last")}
    >
      Last Month
    </button>
    <button
      className={monthType === "previous" ? "active" : ""}
      onClick={() => setMonthType("previous")}
    >
      Previous
    </button>
  </div>

  <button
    className="popup-close"
    onClick={() => setShowPopup(false)}
  >
    ✖
  </button>
</div>

        {roomMembers.length === 0 ? (
          <div className="popup-empty">
            <p>Room is VACANT</p>
          </div>
        ) : (
         <div className="popup-table-wrapper">
  <table className="popup-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Joining Date</th>
        <th>Payment</th>
        <th>Contact</th>
      </tr>
    </thead>
    <tbody>
      {roomMembers.map((member, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td className="member-name">
            {member.name || member.userName || "N/A"}
          </td>
          <td>
            {member.joiningDate
              ? new Date(member.joiningDate).toLocaleDateString()
              : "—"}
          </td>
          <td>
            <span
              className={`payment-badge ${
                member.paymentStatus === "PAID"
                  ? "paid"
                  : member.paymentStatus === "PENDING"
                  ? "pending"
                  : "unknown"
              }`}
            >
              {member.paymentStatus || "UNKNOWN"}
            </span>
          </td>
          <td>
            {member.phone ? (
              <a href={`tel:${member.phone}`} className="contact-btn">
                📞 {member.phone}
              </a>
            ) : (
              "—"
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        )}
      </div>
    </div>,
    document.getElementById("popup-root")
  );
};

  return (
    <div className="myrooms-container">

      {/* PG Selection Header */}
      <div className="myrooms-header">
        <div className="pg-selector">
          <h2>Select PG:</h2>
          <select 
            value={selectedPG?.hostel_id || ""}
            onChange={(e) => {
              const pg = pgs.find(p => p.hostel_id == e.target.value);
              if (pg) {
                setSelectedPG(pg);
                setRooms([]);
                setFilteredRooms([]);
              }
            }}
            className="pg-dropdown"
          >
            {pgs.map(pg => (
              <option key={pg.hostel_id} value={pg.hostel_id}>
                {pg.hostel_name} - {pg.area}, {pg.city}
              </option>
            ))}
          </select>
        </div>
        
        {/* <div className="header-actions">
          <button className="refresh-btn" onClick={handleRefresh}>
            Add new 
          </button>
        </div> */}
      </div>

      
      {/* Room Management - Floors (Image Style) */}
      {roomLoading ? (
        <div className="rooms-loading">
          <div className="spinner small"></div>
          <p>Loading rooms...</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="no-rooms-found">
          <div className="no-rooms-icon">🚪</div>
          <h3>No Rooms Found</h3>
          <p>This PG doesn't have any rooms yet.</p>
        </div>
      ) : (
        <div className="rooms-management">
          {filteredRooms.map(({ floor, rooms: floorRooms }) => (
            <div key={floor} className="floor-section">
              <div className="floor-header">
                <h3 className="floor-title">
                  {getFloorName(floor)}
                </h3>
                <div className="floor-stats">
                  <span className="floor-stat-item">
                    <span className="stat-dot vacant-dot"></span>
                    Vacant: {floorRooms.filter(r => r.status === 'vacant').length}
                  </span>
                  <span className="floor-stat-item">
                    <span className="stat-dot occupied-dot"></span>
                    Occupied: {floorRooms.filter(r => r.status === 'occupied').length}
                  </span>
                </div>
              </div>
              
              {/* Simple Room Numbers Display (like image) */}
              <div className="rooms-simple-display">
                {floorRooms.map(room => (
                  <div 
                    key={room.id} 
                    className="room-simple-box"
                    style={{ 
                      backgroundColor: getStatusColor(room.status),
                      border: `2px solid ${getStatusColor(room.status)}`
                    }}
                    onClick={() => handleRoomClick(room)}
                    title={`Room ${room.room_number} - ${room.status}`}
                  >
                    <span className="room-simple-number">{room.room_number}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

<PopupModal />


    
    </div>

    
  );

  
};

export default MyRooms;