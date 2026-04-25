// src/pages/PGRooms.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./PGRooms.css";

const PGRooms = ({ hostelId, onBack }) => {
  const navigate = useNavigate();
  
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hostel, setHostel] = useState(null);
  const [setupPopup, setSetupPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMode, setPopupMode] = useState("add");
  const [popupData, setPopupData] = useState({ roomNo: "", sharing: "", rent: "" });
  const [activeFloorIndex, setActiveFloorIndex] = useState(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState(null);
  const [roomMembers, setRoomMembers] = useState({});
  const hasLoaded = useRef(false);

  const [setupData, setSetupData] = useState({
    floors: "",
    roomsPerFloor: "",
    sharing: "",
    rent: ""
  });

  // Load Hostel Details from API
  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (!token || !hostelId) return;

        const response = await api.get(`/hostel/${hostelId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const hostelData = response.data.data;
          setHostel(hostelData);
          
          // Check if hostel already has rooms setup
          if (hostelData.total_rooms > 0) {
            // Try to load existing rooms from API
            fetchExistingRooms(hostelId, token);
          } else {
            setSetupPopup(true);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching hostel details:", error);
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, [hostelId]);

  // Fetch existing rooms from API
  const fetchExistingRooms = async (hostelId, token) => {
    try {
      const response = await api.get(`/hostel/${hostelId}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.data) {
        // Transform API data to our format
        const apiFloors = transformAPIData(response.data.data);
        setFloors(apiFloors);
        setSetupPopup(false);
      } else {
        // No rooms found, show setup popup
        setSetupPopup(true);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      // If API fails, check localStorage
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load from localStorage as fallback
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(`pgrooms_${hostelId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFloors(parsed);
          setSetupPopup(false);
          setLoading(false);
          return;
        }
      }
      setSetupPopup(true);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load from localStorage", err);
      setSetupPopup(true);
      setLoading(false);
    }
  };

  // Transform API data to our format
  const transformAPIData = (apiRooms) => {
    // Group rooms by floor
    const floorsMap = {};
    
    apiRooms.forEach(room => {
      const floorNum = room.floor_number || 1;
      if (!floorsMap[floorNum]) {
        floorsMap[floorNum] = {
          floor: `${floorNum}${getOrdinalSuffix(floorNum)} Floor`,
          rooms: []
        };
      }
      
      floorsMap[floorNum].rooms.push({
        roomNo: room.room_number || `R${room.room_id}`,
        beds: Array(room.capacity || 1).fill(false).map((_, index) => 
          room.occupancy && room.occupancy > index
        ),
        rent: room.rent || 0,
        roomId: room.room_id,
        status: room.status || 'available'
      });
    });
    
    // Convert to array
    return Object.values(floorsMap).sort((a, b) => 
      parseInt(a.floor) - parseInt(b.floor)
    );
  };

  const getOrdinalSuffix = (n) => {
    if (n % 10 === 1 && n % 100 !== 11) return "st";
    if (n % 10 === 2 && n % 100 !== 12) return "nd";
    if (n % 10 === 3 && n % 100 !== 13) return "rd";
    return "th";
  };

  // Save to API
  const saveToAPI = async (roomData) => {
    try {
      const token = localStorage.getItem("hlopgToken");
      if (!token) return;

      // Transform our data to API format
      const apiData = floors.flatMap((floor, floorIndex) => 
        floor.rooms.map(room => ({
          hostel_id: parseInt(hostelId),
          floor_number: floorIndex + 1,
          room_number: room.roomNo,
          capacity: room.beds.length,
          rent: room.rent || 0,
          status: 'available',
          occupancy: room.beds.filter(b => b).length
        }))
      );

      const response = await api.post(`/hostel/${hostelId}/rooms/bulk`, {
        rooms: apiData
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.success;
    } catch (error) {
      console.error("Error saving rooms to API:", error);
      return false;
    }
  };

  // Save to localStorage as backup
  const saveToLocalStorage = (data) => {
    localStorage.setItem(`pgrooms_${hostelId}`, JSON.stringify(data));
  };

  // Generate Layout
  const generateLayout = async () => {
    const { floors: numFloors, roomsPerFloor, sharing, rent } = setupData;
    if (!numFloors || !roomsPerFloor || !sharing) {
      alert("Please fill all required fields");
      return;
    }

    const newFloors = Array.from({ length: parseInt(numFloors) }, (_, floorIndex) => ({
      floor: `${floorIndex + 1}${getOrdinalSuffix(floorIndex + 1)} Floor`,
      rooms: Array.from({ length: parseInt(roomsPerFloor) }, (_, roomIndex) => ({
        roomNo: `${floorIndex + 1}${String(roomIndex + 1).padStart(2, "0")}`,
        beds: Array(parseInt(sharing)).fill(false),
        rent: rent || 0,
        roomId: `temp_${floorIndex}_${roomIndex}`
      })),
    }));

    setFloors(newFloors);
    
    // Save to API
    const apiSuccess = await saveToAPI(newFloors);
    if (!apiSuccess) {
      // Fallback to localStorage
      saveToLocalStorage(newFloors);
    }
    
    setSetupPopup(false);
  };

  // Toggle Bed
  const toggleBed = async (floorIndex, roomIndex, bedIndex) => {
    const updated = [...floors];
    updated[floorIndex].rooms[roomIndex].beds[bedIndex] =
      !updated[floorIndex].rooms[roomIndex].beds[bedIndex];
    
    setFloors(updated);
    
    // Update in API
    const room = updated[floorIndex].rooms[roomIndex];
    await updateRoomInAPI(room);
    
    // Update localStorage
    saveToLocalStorage(updated);
  };

  // Update room in API
  const updateRoomInAPI = async (room) => {
    try {
      const token = localStorage.getItem("hlopgToken");
      if (!token || !room.roomId) return;

      await api.put(`/hostel/rooms/${room.roomId}`, {
        occupancy: room.beds.filter(b => b).length,
        status: room.beds.some(b => b) ? 'partially_occupied' : 'available'
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  // Add Floor
  const addFloor = () => {
    const newFloorNum = floors.length + 1;
    const newFloor = {
      floor: `${newFloorNum}${getOrdinalSuffix(newFloorNum)} Floor`,
      rooms: [],
    };

    const updated = [...floors, newFloor];
    setFloors(updated);
    saveToLocalStorage(updated);
  };

  // Open Popup
  const openPopup = (mode, floorIndex, roomIndex = null) => {
    setPopupMode(mode);
    setActiveFloorIndex(floorIndex);
    setActiveRoomIndex(roomIndex);

    if (mode === "edit") {
      const room = floors[floorIndex].rooms[roomIndex];
      setPopupData({
        roomNo: room.roomNo,
        sharing: room.beds.length.toString(),
        rent: room.rent || ""
      });
    } else {
      setPopupData({ roomNo: "", sharing: "", rent: setupData.rent || "" });
    }

    setShowPopup(true);
    setTimeout(() => setPopupVisible(true), 20);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setTimeout(() => setShowPopup(false), 200);
  };

  // Save Room
  const saveRoom = async () => {
    const { roomNo, sharing, rent } = popupData;
    if (!roomNo || !sharing) {
      alert("Please fill all required fields");
      return;
    }

    const numBeds = Math.min(6, Math.max(1, parseInt(sharing)));
    const updated = [...floors];

    const roomData = {
      roomNo,
      beds: Array(numBeds).fill(false),
      rent: rent || 0,
      roomId: `new_${Date.now()}`
    };

    if (popupMode === "add") {
      updated[activeFloorIndex].rooms.push(roomData);
    } else {
      updated[activeFloorIndex].rooms[activeRoomIndex] = roomData;
    }

    setFloors(updated);
    
    // Save to API
    const roomToSave = updated[activeFloorIndex].rooms[
      popupMode === "add" ? updated[activeFloorIndex].rooms.length - 1 : activeRoomIndex
    ];
    await updateRoomInAPI(roomToSave);
    
    // Save to localStorage
    saveToLocalStorage(updated);
    closePopup();
  };

  // Delete Room
  const deleteRoom = async (floorIndex, roomIndex) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    const room = floors[floorIndex].rooms[roomIndex];
    const updated = [...floors];
    updated[floorIndex].rooms.splice(roomIndex, 1);

    setFloors(updated);
    
    // Delete from API if it has a real ID
    if (room.roomId && !room.roomId.startsWith('temp_') && !room.roomId.startsWith('new_')) {
      try {
        const token = localStorage.getItem("hlopgToken");
        await api.delete(`/hostel/rooms/${room.roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
    
    saveToLocalStorage(updated);
  };

  // Fetch room members
  const fetchRoomMembers = async (roomId) => {
    try {
      const token = localStorage.getItem("hlopgToken");
      const response = await api.get(`/hostel/rooms/${roomId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setRoomMembers(prev => ({
          ...prev,
          [roomId]: response.data.data
        }));
      }
    } catch (error) {
      console.error("Error fetching room members:", error);
    }
  };

  // View Room Details
  const viewRoomDetails = (room) => {
    if (room.roomId) {
      fetchRoomMembers(room.roomId);
    }
    
    alert(`Room Details:\nNumber: ${room.roomNo}\nBeds: ${room.beds.length}\nOccupied: ${room.beds.filter(b => b).length}\nRent: ₹${room.rent}/month`);
  };

  // Calculate statistics
  const calculateStats = () => {
    let totalRooms = 0;
    let totalBeds = 0;
    let occupiedBeds = 0;
    let totalRevenue = 0;

    floors.forEach(floor => {
      floor.rooms.forEach(room => {
        totalRooms++;
        totalBeds += room.beds.length;
        occupiedBeds += room.beds.filter(b => b).length;
        totalRevenue += room.rent || 0;
      });
    });

    return { totalRooms, totalBeds, occupiedBeds, totalRevenue };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="pgrooms-loading">
        <div className="spinner"></div>
        <p>Loading room layout...</p>
      </div>
    );
  }

  return (
    <div className="pgrooms-container">
      {/* Header */}
      <div className="pgrooms-header">
        <div className="pgrooms-header-left">
          <button className="back-btn" onClick={onBack}>
            ← Back to PG Selection
          </button>
          <h1>
            {hostel ? `${hostel.hostel_name} - Room Management` : 'Room Management'}
          </h1>
          <p>{hostel && `${hostel.area}, ${hostel.city}`}</p>
        </div>
        
        <div className="pgrooms-stats">
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-info">
              <h3>{stats.totalRooms}</h3>
              <p>Total Rooms</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛏️</div>
            <div className="stat-info">
              <h3>{stats.totalBeds}</h3>
              <p>Total Beds</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.occupiedBeds}</h3>
              <p>Occupied Beds</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>₹{stats.totalRevenue}</h3>
              <p>Monthly Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="pgrooms-actions">
        {floors.length > 0 && (
          <>
            <button className="action-btn primary" onClick={addFloor}>
              + Add Floor
            </button>
            <button 
              className="action-btn secondary" 
              onClick={() => setSetupPopup(true)}
            >
              Regenerate Layout
            </button>
          </>
        )}
      </div>

      {/* Floors Display */}
      {floors.map((floor, floorIndex) => (
        <div key={floorIndex} className="pgrooms-floor-section">
          <div className="pgrooms-floor-header">
            <h3>{floor.floor}</h3>
            <button
              className="add-room-btn"
              onClick={() => openPopup("add", floorIndex)}
            >
              + Add Room
            </button>
          </div>

          {floor.rooms.length === 0 ? (
            <div className="no-rooms-message">
              <p>No rooms on this floor. Add your first room!</p>
            </div>
          ) : (
            <div className="pgrooms-rooms-grid">
              {floor.rooms.map((room, roomIndex) => (
                <div key={roomIndex} className="pgrooms-room-card">
                  <div className="room-card-header">
                    <div className="room-title">
                      <h4>Room {room.roomNo}</h4>
                      <span className="room-rent">₹{room.rent}/month</span>
                    </div>
                    <div className="room-actions">
                      <button 
                        className="icon-btn view-btn"
                        onClick={() => viewRoomDetails(room)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        className="icon-btn edit-btn"
                        onClick={() => openPopup("edit", floorIndex, roomIndex)}
                        title="Edit Room"
                      >
                        ✏️
                      </button>
                      <button 
                        className="icon-btn delete-btn"
                        onClick={() => deleteRoom(floorIndex, roomIndex)}
                        title="Delete Room"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="room-beds-container">
                    <div className="beds-grid">
                      {room.beds.map((filled, bedIndex) => (
                        <div
                          key={bedIndex}
                          className={`bed ${filled ? "filled" : "empty"}`}
                          onClick={() => toggleBed(floorIndex, roomIndex, bedIndex)}
                          title={filled ? "Occupied - Click to vacate" : "Vacant - Click to occupy"}
                        >
                          <div className="bed-number">{bedIndex + 1}</div>
                          <div className="bed-status">
                            {filled ? "✅" : "🛏️"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="room-footer">
                    <div className="room-stats">
                      <span className="stat-item">
                        <strong>{room.beds.filter(b => b).length}</strong> / {room.beds.length} filled
                      </span>
                      <span className={`status-badge ${room.beds.filter(b => b).length === room.beds.length ? 'full' : room.beds.filter(b => b).length > 0 ? 'partial' : 'empty'}`}>
                        {room.beds.filter(b => b).length === room.beds.length ? 'Full' : 
                         room.beds.filter(b => b).length > 0 ? 'Partially Occupied' : 'Vacant'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Setup Popup */}
      {setupPopup && (
        <div className="pgrooms-popup-overlay show">
          <div className="pgrooms-popup-content pgrooms-popup-in">
            <h3>Setup Room Layout</h3>
            <p>Configure initial room structure</p>

            <div className="form-group">
              <label>Number of Floors *</label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="e.g., 3"
                value={setupData.floors}
                onChange={(e) => setSetupData({ ...setupData, floors: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Rooms per Floor *</label>
              <input
                type="number"
                min="1"
                max="30"
                placeholder="e.g., 10"
                value={setupData.roomsPerFloor}
                onChange={(e) => setSetupData({ ...setupData, roomsPerFloor: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Beds per Room *</label>
              <input
                type="number"
                min="1"
                max="6"
                placeholder="e.g., 3"
                value={setupData.sharing}
                onChange={(e) => setSetupData({ ...setupData, sharing: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Monthly Rent per Bed (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 5000"
                value={setupData.rent}
                onChange={(e) => setSetupData({ ...setupData, rent: e.target.value })}
              />
            </div>

            <div className="popup-buttons">
              <button 
                className="cancel-btn" 
                onClick={() => floors.length > 0 ? setSetupPopup(false) : onBack()}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={generateLayout}>
                Generate Layout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Room Popup */}
      {showPopup && (
        <div className={`pgrooms-popup-overlay ${popupVisible ? "show" : "hide"}`}>
          <div className={`pgrooms-popup-content ${popupVisible ? "pgrooms-popup-in" : "pgrooms-popup-out"}`}>
            <h3>{popupMode === "add" ? "Add New Room" : "Edit Room"}</h3>

            <div className="form-group">
              <label>Room Number *</label>
              <input
                type="text"
                placeholder="e.g., 101, 201A"
                value={popupData.roomNo}
                onChange={(e) => setPopupData({ ...popupData, roomNo: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Number of Beds *</label>
              <input
                type="number"
                min="1"
                max="6"
                placeholder="e.g., 2"
                value={popupData.sharing}
                onChange={(e) => setPopupData({ ...popupData, sharing: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Monthly Rent per Bed (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 5000"
                value={popupData.rent}
                onChange={(e) => setPopupData({ ...popupData, rent: e.target.value })}
              />
            </div>

            <div className="popup-buttons">
              <button className="cancel-btn" onClick={closePopup}>
                Cancel
              </button>
              <button className="save-btn" onClick={saveRoom}>
                {popupMode === "add" ? "Add Room" : "Update Room"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {floors.length === 0 && !setupPopup && (
        <div className="pgrooms-empty-state">
          <div className="empty-icon">🏠</div>
          <h3>No Room Layout Setup</h3>
          <p>You need to setup the room layout for this PG.</p>
          <button 
            className="setup-btn"
            onClick={() => setSetupPopup(true)}
          >
            Setup Room Layout
          </button>
        </div>
      )}
    </div>
  );
};

export default PGRooms;