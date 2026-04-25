

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./MyPGs.css";

import pgDefaultImg from "../assets/pg1.png";
import { 
  FaTimes, FaMapMarkerAlt, FaRupeeSign, FaBed, FaUserFriends, 
  FaHome, FaPhone, FaEnvelope, FaWifi, FaCar, FaSnowflake, 
  FaUtensils, FaShower, FaTv, FaDumbbell,
  FaWineBottle, FaSmokingBan, FaPaw, FaBroom, FaPlus,
  FaFan, FaLightbulb, FaChair, FaThermometerHalf,
  FaChevronDown, FaChevronUp
} from "react-icons/fa";

const MyPGs = ({ user }) => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPGId, setExpandedPGId] = useState(null); // Track which PG is expanded
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  // Form states - same as UploadPG
  const [pgImages, setPgImages] = useState([]);
  const [pgImageFiles, setPgImageFiles] = useState([]);
  const [selectedPgType, setSelectedPgType] = useState("");
  const [pgName, setPgName] = useState("");
  const [pgInfo, setPgInfo] = useState("");
  const [sharingOptions, setSharingOptions] = useState([{ type: "", price: "" }]);
  const [numFloors, setNumFloors] = useState("");
  const [roomsPerFloor, setRoomsPerFloor] = useState("");
  const [startingRoomNumber, setStartingRoomNumber] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [selectedFurnish, setSelectedFurnish] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [foodMenu, setFoodMenu] = useState({
    monday: { breakfast: "", lunch: "", dinner: "" },
    tuesday: { breakfast: "", lunch: "", dinner: "" },
    wednesday: { breakfast: "", lunch: "", dinner: "" },
    thursday: { breakfast: "", lunch: "", dinner: "" },
    friday: { breakfast: "", lunch: "", dinner: "" },
    saturday: { breakfast: "", lunch: "", dinner: "" },
    sunday: { breakfast: "", lunch: "", dinner: "" },
  });
  const [pgLocation, setPgLocation] = useState({
    address: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  const locationData = {
    Telangana: {
      Hyderabad: ["Ameerpet", "Dilshuknagar", "Gachibowli", "Gandimaisamma", "Kondapur", "KPHB", "LB Nagar", "Medchal", "Moosapet", "Madhapur", "Patancheruvu", "Uppal"],
      Warangal: ["Hanamkonda", "Kazipet"]
    },
    Karnataka: {
      Bangalore: ["Bannerghatta", "Basavanagudi", "Devanahalli", "Electronic City", "Hebbal", "Hoskote", "HSR Layout", "Indiranagar", "Jayanagar", "Kengeri", "Koramangala", "Madiwala", "Marathahalli", "Sarjapur Road", "Ulsoor", "Whitefield"],
      Mysore: ["Gokulam", "Vijayanagar"]
    },
    AndhraPradesh: {
      Vijayawada: ["Benz Circle", "Gunadala", "Poranki"],
      Vizag: ["Gajuwaka", "MVP Colony"]
    },
    Maharashtra: {
      Mumbai: ["Airoli", "Andheri", "Borivali", "Chembur", "Goregaon", "Jogeshwari", "Juhu", "Kandivali", "Kurla", "Malabar Hill", "Marine Drive", "Mira Road", "Powai", "Thane", "Vikhroli", "Virar"],
      Pune: ["Aundh", "Baner", "Hadapsar", "Hinjewadi", "Kalyani Nagar", "Kharadi", "Koregaon Park", "Kothrud"]
    },
    TamilNadu: {
      Chennai: ["Ambattur", "Anna Nagar", "Gopalapuram", "Kotturpuram", "Medavakkam", "Navalur", "Perungudi", "Porur", "Semmancheri", "Tambaram", "Thoraipakkam", "Velachery"]
    }
  };

  const amenityKeys = {
    "Free WiFi": "wifi",
    Fan: "fan",
    Bed: "bed",
    Lights: "lights",
    Cupboard: "cupboard",
    Geyser: "geyser",
    Water: "water",
    Gym: "gym",
    TV: "tv",
    Food: "food",
    Parking: "parking",
    AC: "ac",
  };

  const reverseAmenityKeys = {
    wifi: "Free WiFi",
    fan: "Fan",
    bed: "Bed",
    lights: "Lights",
    cupboard: "Cupboard",
    geyser: "Geyser",
    water: "Water",
    gym: "Gym",
    tv: "TV",
    food: "Food",
    parking: "Parking",
    ac: "AC",
  };

  const rules = [
    { name: "No Alcohol", icon: <FaWineBottle /> },
    { name: "No Smoking", icon: <FaSmokingBan /> },
    { name: "No Pets", icon: <FaPaw /> },
    { name: "Keep Clean", icon: <FaBroom /> },
  ];

  useEffect(() => {
    const fetchOwnerPGs = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (!token) {
          setError("Please login first");
          setLoading(false);
          return;
        }

        const res = await api.get("/hostel/owner/pgs", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (res.data.success) {
          const pgData = res.data.data || res.data.hostels || [];
          
          const processedPGs = pgData.map(pg => {
            let images = [];
            
            if (pg.images && Array.isArray(pg.images)) {
              images = pg.images.map(img => {
                if (img.startsWith('http')) return img;
                if (img.startsWith('/uploads')) return `http://18.61.100.138:8080${img}`;
                if (img) return `http://18.61.100.138:8080/uploads/${img}`;
                return pgDefaultImg;
              });
            } else if (pg.img) {
              images = [pg.img.startsWith('http') ? pg.img : `http://18.61.100.138:8080${pg.img}`];
            } else {
              images = [pgDefaultImg];
            }
            
            return {
              ...pg,
              images: images,
              displayImage: images[0] || pgDefaultImg
            };
          });
          
          setPgs(processedPGs);
        } else {
          setError(res.data.message || "Failed to load PGs");
        }
      } catch (err) {
        console.error("Error fetching PGs:", err);
        setError("Failed to fetch PGs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerPGs();
  }, []);

  const handleCardClick = (pg) => {
    if (expandedPGId === pg.hostel_id) {
      // If clicking the same PG, close it
      setExpandedPGId(null);
      resetForm();
      return;
    }
    
    setExpandedPGId(pg.hostel_id);
    
    // Populate form with PG data
    setPgName(pg.hostel_name || pg.name || "");
    setPgInfo(pg.description || pg.pg_info || "");
    setSelectedPgType(pg.pg_type || "");
    setAdvanceAmount(pg.advance_amount || "");
    
    // Set location
    setPgLocation({
      address: pg.address || "",
      area: pg.area || "",
      city: pg.city || "",
      state: pg.state || "",
      pincode: pg.pincode || "",
    });
    
    // Set sharing options
    try {
  if (pg.sharing) {
    const sharingData =
      typeof pg.sharing === "string"
        ? JSON.parse(pg.sharing || "{}")
        : pg.sharing || {};

    if (sharingData && typeof sharingData === "object") {
      const options = Object.keys(sharingData).map((type) => ({
        type,
        price: String(sharingData[type] ?? ""),
      }));

      setSharingOptions(
        options.length > 0 ? options : [{ type: "", price: "" }]
      );
    } else {
      setSharingOptions([{ type: "", price: "" }]);
    }
  } else {
    setSharingOptions([{ type: "", price: "" }]);
  }
} catch (err) {
  console.error("Sharing parse error:", err);
  setSharingOptions([{ type: "", price: "" }]);
}
    
   // Set amenities
 if (pg.furnish || pg.amenities) {
   try {
     const amenitiesData = pg.furnish || pg.amenities;
     const parsed =
       typeof amenitiesData === "string"
         ? JSON.parse(amenitiesData)
         : amenitiesData;

     const selected = [];

     Object.keys(parsed).forEach((key) => {
       if (parsed[key] === true && reverseAmenityKeys[key]) {
         selected.push(reverseAmenityKeys[key]);
       }
     });

     setSelectedFurnish(selected);
   } catch (e) {
     setSelectedFurnish([]);
   }
 }
    
    // Set rules
    if (pg.rules) {
      try {
        const rulesData = typeof pg.rules === 'string' ? JSON.parse(pg.rules) : pg.rules;
        setSelectedRules(Array.isArray(rulesData) ? rulesData : []);
      } catch (e) {
        setSelectedRules([]);
      }
    }
    
    // Set food menu
    if (pg.foodMenu) {
      try {
        const menuData = typeof pg.foodMenu === 'string' ? JSON.parse(pg.foodMenu) : pg.foodMenu;
        setFoodMenu(menuData);
      } catch (e) {
        // Keep default
      }
    }
    
    // Set floor/room info
    setNumFloors(pg.numFloors || "");
    setRoomsPerFloor(pg.roomsPerFloor || "");
    setStartingRoomNumber(pg.startingRoomNumber || "");
    
    // Set images
    if (pg.images && pg.images.length > 0) {
      setPgImages(pg.images);
    }
  };

  const resetForm = () => {
    setPgName("");
    setPgInfo("");
    setSelectedPgType("");
    setPgImages([]);
    setPgImageFiles([]);
    setPgLocation({ address: "", area: "", city: "", state: "", pincode: "" });
    setSharingOptions([{ type: "", price: "" }]);
    setSelectedFurnish([]);
    setSelectedRules([]);
    setFoodMenu({
      monday: { breakfast: "", lunch: "", dinner: "" },
      tuesday: { breakfast: "", lunch: "", dinner: "" },
      wednesday: { breakfast: "", lunch: "", dinner: "" },
      thursday: { breakfast: "", lunch: "", dinner: "" },
      friday: { breakfast: "", lunch: "", dinner: "" },
      saturday: { breakfast: "", lunch: "", dinner: "" },
      sunday: { breakfast: "", lunch: "", dinner: "" },
    });
    setNumFloors("");
    setRoomsPerFloor("");
    setStartingRoomNumber("");
    setAdvanceAmount("");
  };

  // Helper functions from UploadPG
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setPgImages((prev) => [...prev, ...imageUrls]);
    setPgImageFiles((prev) => [...prev, ...files]);
  };

  const toggleFurnish = (name) => {
    setSelectedFurnish((prev) => (prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]));
  };

  const toggleRule = (ruleName) => {
    setSelectedRules((prev) => (prev.includes(ruleName) ? prev.filter((r) => r !== ruleName) : [...prev, ruleName]));
  };

  const handleFoodChange = (day, meal, value) => {
    setFoodMenu((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: value } }));
  };

  const handlePgTypeSelect = (type) => {
    setSelectedPgType(type);
  };

  const handleLocationChange = (field, value) => {
    setPgLocation((prev) => ({ ...prev, [field]: value }));
  };

  const addSharingRow = () => setSharingOptions((prev) => [...prev, { type: "", price: "" }]);
  const removeSharingRow = (index) => setSharingOptions((prev) => prev.filter((_, i) => i !== index));

  const buildSharingObject = () => {
    const sharingObject = {};
    sharingOptions.forEach((opt) => {
      if (opt.type && opt.price) sharingObject[opt.type] = Number(opt.price);
    });
    return sharingObject;
  };

  // Update PG function
  const handleUpdatePG = async (e, pgId) => {
    e.preventDefault();
    if (!pgName || !pgInfo || !selectedPgType) {
      alert("Please fill all required fields before saving.");
      return;
    }

    setFormLoading(true);
    try {
      const token = localStorage.getItem("hlopgToken");
      const formData = new FormData();

      formData.append("pgName", pgName);
      formData.append("pgInfo", pgInfo);
      formData.append("pgType", selectedPgType);

      formData.append("address", pgLocation.address || "");
      formData.append("area", pgLocation.area || "");
      formData.append("city", pgLocation.city || "");
      formData.append("state", pgLocation.state || "");
      formData.append("pincode", pgLocation.pincode || "");

      formData.append("sharing", JSON.stringify(buildSharingObject()));
      formData.append("rules", JSON.stringify(selectedRules));

      const amenityObject = {};
      selectedFurnish.forEach((item) => {
        const key = amenityKeys[item];
        if (key) amenityObject[key] = true;
      });
      formData.append("furnish", JSON.stringify(amenityObject));

      formData.append("foodMenu", JSON.stringify(foodMenu));
      formData.append("numFloors", numFloors);
      formData.append("roomsPerFloor", roomsPerFloor);
      formData.append("startingRoomNumber", startingRoomNumber);
      formData.append("advanceAmount", advanceAmount);

      // Add new image files if any
      pgImageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Update endpoint (you may need to adjust this based on your backend)
      const res = await api.put(`/hostel/update/${pgId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        alert("PG Updated Successfully!");
        // Update the PG in the list
        setPgs(prev => prev.map(pg => 
          pg.hostel_id === pgId ? { ...pg, ...res.data.data } : pg
        ));
        setExpandedPGId(null);
        resetForm();
      } else {
        alert(res.data.message || "Failed to update PG");
      }
    } catch (err) {
      console.error("PG update error:", err);
      alert("Failed to update PG");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return (
    <div className="my-pgs-page">
      <h3>My PGs</h3>
      <div className="loading">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="my-pgs-page">
      <h3>My PGs</h3>
      <div className="error">{error}</div>
    </div>
  );

  return (
    <div className="my-pgs-page">
      <h3>My PGs ({pgs.length})</h3>

      {pgs.length === 0 ? (
        <div className="no-pgs">
          <p>No PGs found</p>
        </div>
      ) : (
        <div className="pgs-container">
          {/* Cards Grid - Keep existing design */}
          <div className="pgs-grid">
            {pgs.map((pg) => (
              <div 
                className={`pg-card ${expandedPGId === pg.hostel_id ? 'selected' : ''}`} 
                key={pg.hostel_id || pg.id}
                onClick={() => handleCardClick(pg)}
              >
                <div className="card-image">
                  <img
                    src={pg.displayImage || pgDefaultImg}
                    alt={pg.hostel_name || pg.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = pgDefaultImg;
                    }}
                  />
                </div>
                
                <div className="card-content">
                  <h4>{pg.hostel_name || pg.name}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Form Section - Shows below all cards */}
          {expandedPGId && (
            <div className="edit-form-section">
              <div className="form-header">
                <h3>Edit PG Details</h3>
                <button className="close-form-btn" onClick={() => {
                  setExpandedPGId(null);
                  resetForm();
                }}>
                  <FaTimes /> Close
                </button>
              </div>
              
              <form className="pg-form" onSubmit={(e) => handleUpdatePG(e, expandedPGId)}>
                <label>PG Name</label>
                <input type="text" placeholder="Enter PG Name" value={pgName} onChange={(e) => setPgName(e.target.value)} />

                <label>PG Information</label>
                <input type="text" placeholder="Enter PG Information" value={pgInfo} onChange={(e) => setPgInfo(e.target.value)} />

                <label>PG Type</label>
                <div className="pg-type">
                  {["Men", "Women", "Co-Living"].map((type) => (
                    <button type="button" key={type} className={`pg-type-btn ${selectedPgType === type ? "selected" : ""}`} onClick={() => handlePgTypeSelect(type)}>
                      {type}
                    </button>
                  ))}
                </div>

                <label>PG Location</label>
                <div className="pg-location">
                  <select
                    value={pgLocation.state}
                    onChange={(e) =>
                      setPgLocation((prev) => ({
                        ...prev,
                        state: e.target.value,
                        city: "",
                        area: "",
                      }))
                    }
                  >
                    <option value="">Select State</option>
                    {Object.keys(locationData).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>

                  <select
                    value={pgLocation.city}
                    onChange={(e) =>
                      setPgLocation((prev) => ({
                        ...prev,
                        city: e.target.value,
                        area: "",
                      }))
                    }
                    disabled={!pgLocation.state}
                  >
                    <option value="">Select City</option>
                    {pgLocation.state &&
                      Object.keys(locationData[pgLocation.state]).map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>

                  <select value={pgLocation.area} onChange={(e) => setPgLocation((prev) => ({ ...prev, area: e.target.value }))} disabled={!pgLocation.city}>
                    <option value="">Select Area</option>
                    {pgLocation.city && locationData[pgLocation.state][pgLocation.city].map((area) => <option key={area} value={area}>{area}</option>)}
                  </select>

                  <input type="text" placeholder="Address" value={pgLocation.address} onChange={(e) => handleLocationChange("address", e.target.value)} />
                  <input type="text" placeholder="Pincode" value={pgLocation.pincode} onChange={(e) => handleLocationChange("pincode", e.target.value)} />
                </div>

                <label>PG Images</label>
                <div className="pg-images">
                  {pgImages.map((img, i) => (
                    <img key={i} src={img} alt={`PG ${i}`} />
                  ))}

                  <label className="upload-btn">
                    +
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                  </label>
                </div>

                {/* PG Sharing Options */}
                <h3 className="black-text">PG Sharing Type & Price</h3>
                {sharingOptions.map((item, index) => (
                  <div key={index} className="sharing-row">
                    <select
                      value={item.type}
                      onChange={(e) => {
                        const updated = [...sharingOptions];
                        updated[index].type = e.target.value;
                        setSharingOptions(updated);
                      }}
                      className="sharing-dropdown"
                    >
                      <option value="">Select Sharing</option>
                      <option value="single">1 Sharing (Single)</option>
                      <option value="double">2 Sharing (Double)</option>
                      <option value="triple">3 Sharing (Triple)</option>
                      <option value="four">4 Sharing</option>
                      <option value="five">5 Sharing</option>
                      <option value="six">6 Sharing</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Price per month"
                      value={item.price}
                      onChange={(e) => {
                        const updated = [...sharingOptions];
                        updated[index].price = e.target.value;
                        setSharingOptions(updated);
                      }}
                      className="price-input"
                    />

                    {index > 0 && (
                      <button type="button" onClick={() => removeSharingRow(index)} className="remove-sharing">
                        ❌
                      </button>
                    )}
                  </div>
                ))}

                <button type="button" className="add-sharing-btn" onClick={addSharingRow}>
                  ➕ Add Another Sharing
                </button>

                <div className="floor-rooms-section">
                  <h3 className="black-text">Select PG Floors and Rooms</h3>
                  
                  <div className="floor-input-group">
                    <div className="input-field">
                      <label>1. Number of Floors in your building</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="10"
                        placeholder="e.g., 3"
                        value={numFloors}
                        onChange={(e) => setNumFloors(e.target.value)}
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>2. Number of Rooms in a Floor</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="20"
                        placeholder="e.g., 5"
                        value={roomsPerFloor}
                        onChange={(e) => setRoomsPerFloor(e.target.value)}
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>3. Enter Starting Room number</label>
                      <input 
                        type="text" 
                        placeholder="e.g., 101 or G01"
                        value={startingRoomNumber}
                        onChange={(e) => setStartingRoomNumber(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="advance-amount-section">
                  <h3 className="black-text">Advance Amount</h3>
                  <div className="advance-input-group">
                    <input 
                      type="number"
                      placeholder="Enter advance amount"
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(e.target.value)}
                    />
                  </div>
                </div>

                <label>Food Menu Details</label>
                <div className="food-menu-table">
                  <table>
                    <thead>
                      <tr>
                        <th>DAYS</th>
                        <th>BREAKFAST</th>
                        <th>LUNCH</th>
                        <th>DINNER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(foodMenu).map((day) => (
                        <tr key={day}>
                          <td className="day-cell">{day.toUpperCase()}</td>
                          <td>
                            <input type="text" placeholder="Breakfast" value={foodMenu[day].breakfast} onChange={(e) => handleFoodChange(day, "breakfast", e.target.value)} />
                          </td>
                          <td>
                            <input type="text" placeholder="Lunch" value={foodMenu[day].lunch} onChange={(e) => handleFoodChange(day, "lunch", e.target.value)} />
                          </td>
                          <td>
                            <input type="text" placeholder="Dinner" value={foodMenu[day].dinner} onChange={(e) => handleFoodChange(day, "dinner", e.target.value)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <label>Furnished Amenities</label>
                <div className="furnished-icons">
                  {[
                    { icon: <FaWifi />, name: "Free WiFi" },
                    { icon: <FaFan />, name: "Fan" },
                    { icon: <FaBed />, name: "Bed" },
                    { icon: <FaLightbulb />, name: "Lights" },
                    { icon: <FaChair />, name: "Cupboard" },
                    { icon: <FaShower />, name: "Geyser" },
                    { icon: <FaThermometerHalf />, name: "Water" },
                    { icon: <FaDumbbell />, name: "Gym" },
                    { icon: <FaTv />, name: "TV" },
                    { icon: <FaUtensils />, name: "Food" },
                    { icon: <FaCar />, name: "Parking" },
                    { icon: <FaSnowflake />, name: "AC" },
                  ].map((f, i) => (
                    <div key={i} className={`furnish-icon ${selectedFurnish.includes(f.name) ? "selected" : ""}`} onClick={() => toggleFurnish(f.name)}>
                      {f.icon}
                      <span>{f.name}</span>
                    </div>
                  ))}
                </div>

                <label>Rules</label>
                <div className="rules-section">
                  {rules.map((rule, index) => (
                    <div key={index} className={`rule-item ${selectedRules.includes(rule.name) ? "selected" : ""}`} onClick={() => toggleRule(rule.name)}>
                      {rule.icon}
                      <span>{rule.name}</span>
                    </div>
                  ))}
                  <div
                    className="rule-item add-rule"
                    onClick={() => {
                      const newRule = prompt("Enter new rule:");
                      if (newRule) setSelectedRules(prev => [...prev, newRule]);
                    }}
                  >
                    <FaPlus />
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={formLoading}>
                  {formLoading ? "Updating..." : "Update PG"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPGs;