// src/pages/UploadPG.jsx
import React, { useState, useEffect } from "react";
import "./UploadPG.css";
import api from "../api";
 
import { FaWifi,  FaFan,  FaBed,  FaLightbulb,  FaThermometerHalf,  FaShower,  FaChair,  FaTv,
  FaUtensils,  FaDumbbell,  FaCar,  FaSnowflake,  FaPlus,  FaSmokingBan,  FaWineBottle,
  FaPaw,  FaBroom,
} from "react-icons/fa";



const UploadPG = ({ user }) => {
  // basic PG fields
  const [pgImages, setPgImages] = useState([]); // preview URLs
  const [pgImageFiles, setPgImageFiles] = useState([]); // actual File objects
  const [selectedPgType, setSelectedPgType] = useState("");
  const [pgName, setPgName] = useState("");
  const [pgInfo, setPgInfo] = useState("");
  const [owner, setOwner] = useState(null);
  const ownerId = user?.owner_id;

  // location data
  const locationData = {
      "Andhra Pradesh": {
    "Vizag": ["Gajuwaka", "MVP Colony", "Dwarakanagar", "Siripuram"],
    "Vijayawada": ["Benz Circle", "Poranki", "Gunadala", "Patamata"],
    "Guntur": ["Arundelpet", "Lakshmipuram", "Brodipet"]
  },
  "Telangana": {
    "Hyderabad": ["Ameerpet", "Gachibowli", "Madhapur", "KPHB", "Hitech City", "Banjara Hills"],
    "Warangal": ["Hanamkonda", "Kazipet", "Subedari"],
    "Karimnagar": ["Kaman", "Vavilala Street"]
  },
  "Karnataka": {
    "Bangalore": ["Koramangala", "HSR Layout", "Indiranagar", "Whitefield", "Marathahalli"],
    "Mysore": ["Vijayanagar", "Gokulam", "Kuvempunagar"],
    "Mangalore": ["Kadri", "Bejai", "Urwa"]
  },
  "Maharashtra": {
    "Mumbai": ["Andheri", "Bandra", "Powai", "Thane", "Dadar"],
    "Pune": ["Hinjewadi", "Kharadi", "Viman Nagar", "Koregaon Park", "Baner"],
    "Nagpur": ["Sadar", "Dharampeth", "Manewada"]
  },
  "Tamil Nadu": {
    "Chennai": ["Adyar", "Anna Nagar", "T Nagar", "Velachery", "OMR"],
    "Coimbatore": ["RS Puram", "Saibaba Colony", "Gandhipuram"],
    "Madurai": ["KK Nagar", "Villapuram", "Simmakkal"]
  },
  "Delhi": {
    "New Delhi": ["Connaught Place", "Karol Bagh", "Chanakyapuri"],
    "South Delhi": ["Saket", "Hauz Khas", "Greater Kailash"],
    "West Delhi": ["Rajouri Garden", "Janakpuri", "Dwarka"]
  },
  "Uttar Pradesh": {
    "Lucknow": ["Gomti Nagar", "Hazratganj", "Indira Nagar"],
    "Noida": ["Sector 62", "Sector 128", "Sector 18"],
    "Ghaziabad": ["Vaishali", "Kaushambi", "Indirapuram"]
  },
  "Gujarat": {
    "Ahmedabad": ["SG Highway", "Prahlad Nagar", "Maninagar"],
    "Surat": ["Athwa Lines", "Varachha", "Adajan"],
    "Vadodara": ["Alkapuri", "Fatehganj", "Gotri"]
  },
  "Arunachal Pradesh": {
    "Itanagar": ["Naharlagun", "Ganga Market"],
    "Tawang": ["Old Market", "Army Area"]
  },

  "Assam": {
    "Guwahati": ["Dispur", "Paltan Bazar"],
    "Silchar": ["Malugram", "Tarapur"]
  },

  "Bihar": {
    "Patna": ["Boring Road", "Kankarbagh"],
    "Gaya": ["Civil Lines", "Tekari Road"]
  },

  "Chhattisgarh": {
    "Raipur": ["Pandri", "Telibandha"],
    "Bilaspur": ["Vyapar Vihar", "Sarkanda"]
  },

  "Goa": {
    "Panaji": ["Miramar", "Altinho"],
    "Margao": ["Fatorda", "Borda"]
  },

 "Haryana": {
    "Gurgaon": ["DLF Phase 1", "Sohna Road"],
    "Faridabad": ["Sector 15", "Ballabhgarh"]
  },

  "Himachal Pradesh": {
    "Shimla": ["Mall Road", "Kufri"],
    "Mandi": ["Seri Bazar", "Nerchowk"]
  },

  "Jharkhand": {
    "Ranchi": ["Lalpur", "Doranda"],
    "Jamshedpur": ["Bistupur", "Sakchi"]
  },

 
  "Kerala": {
    "Kochi": ["Kakkanad", "Edappally"],
    "Trivandrum": ["Kowdiar", "Pattom"]
  },

  "Madhya Pradesh": {
    "Bhopal": ["MP Nagar", "Arera Colony"],
    "Indore": ["Vijay Nagar", "Palasia"]
  },
"Manipur": {
    "Imphal": ["Thangal Bazar", "Lamphel"],
    "Bishnupur": ["Moirang", "Nambol"]
  },

  "Meghalaya": {
    "Shillong": ["Police Bazar", "Laitumkhrah"],
    "Tura": ["Rongkhon", "Araimile"]
  },

  "Mizoram": {
    "Aizawl": ["Zarkawt", "Chanmari"],
    "Lunglei": ["Bazar Area", "Venglai"]
  },

  "Nagaland": {
    "Kohima": ["Main Town", "High School Area"],
    "Dimapur": ["City Tower", "Chumukedima"]
  },

  "Odisha": {
    "Bhubaneswar": ["Patia", "Jaydev Vihar"],
    "Cuttack": ["Badambadi", "College Square"]
  },

  "Punjab": {
    "Ludhiana": ["Civil Lines", "Model Town"],
    "Amritsar": ["Ranjit Avenue", "Golden Temple Area"]
  },

  "Rajasthan": {
    "Jaipur": ["Malviya Nagar", "Vaishali Nagar"],
    "Udaipur": ["Hiran Magri", "Fatehpura"]
  },

  "Sikkim": {
    "Gangtok": ["MG Marg", "Deorali"],
    "Namchi": ["Upper Bazar", "Singithang"]
  },
  "Tripura": {
    "Agartala": ["Banamalipur", "Jogendranagar"],
    "Udaipur": ["Radhakishorepur", "Matabari"]
  },
  "Uttarakhand": {
    "Dehradun": ["Rajpur Road", "ISBT"],
    "Haridwar": ["Jwalapur", "Kankhal"]
  },

  "West Bengal": {
    "Kolkata": ["Salt Lake", "Ballygunge"],
    "Siliguri": ["Sevoke Road", "Pradhan Nagar"]
  }

};
 

  // sharing options (type & price)
  const [sharingOptions, setSharingOptions] = useState([{ type: "", price: "" }]);

  const [numFloors, setNumFloors] = useState("");
const [roomsPerFloor, setRoomsPerFloor] = useState("");
const [startingRoomNumber, setStartingRoomNumber] = useState("");
const [advanceAmount, setAdvanceAmount] = useState("");

  // amenity keys mapping (backend friendly keys)
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

  const [pgLocation, setPgLocation] = useState({
    address: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  // rules and selected rules
  const [rules, setRules] = useState([
    { name: "No Alcohol", icon: <FaWineBottle /> },
    { name: "No Smoking", icon: <FaSmokingBan /> },
    { name: "No Pets", icon: <FaPaw /> },
    { name: "Keep Clean", icon: <FaBroom /> },
  ]);
  const [selectedRules, setSelectedRules] = useState([]);

  // selected furnish/amenities
  const [selectedFurnish, setSelectedFurnish] = useState([]);

  // food menu
  const [foodMenu, setFoodMenu] = useState({
    monday: { breakfast: "", lunch: "", dinner: "" },
    tuesday: { breakfast: "", lunch: "", dinner: "" },
    wednesday: { breakfast: "", lunch: "", dinner: "" },
    thursday: { breakfast: "", lunch: "", dinner: "" },
    friday: { breakfast: "", lunch: "", dinner: "" },
    saturday: { breakfast: "", lunch: "", dinner: "" },
    sunday: { breakfast: "", lunch: "", dinner: "" },
  });
  const days = Object.keys(foodMenu);

  // UI state
  const [loading, setLoading] = useState(false);

  // fetch owner id on mount
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (!token) return;
        const res = await api.get("/auth/ownerid", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOwner(res.data.owner_id);
        console.log("Owner:", res.data.owner_id);
      } catch (err) {
        console.error("Owner fetch failed", err);
      }
    };
    fetchOwner();
  }, []);

  // image preview + store files
  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files || []);
  //   const imageUrls = files.map((file) => URL.createObjectURL(file));
  //   setPgImages((prev) => [...prev, ...imageUrls]);
  //   setPgImageFiles((prev) => [...prev, ...files]);
  // };

  const handleImageUpload = (e) => {
  const files = Array.from(e.target.files || []);

  // Remaining slots
  const remainingSlots = 5 - pgImages.length;

  if (remainingSlots <= 0) {
    e.target.value = null;
    return;
  }

  // Only allow files up to remaining slots
  const allowedFiles = files.slice(0, remainingSlots);

  const imageUrls = allowedFiles.map((file) =>
    URL.createObjectURL(file)
  );

  setPgImages((prev) => [...prev, ...imageUrls]);
  setPgImageFiles((prev) => [...prev, ...allowedFiles]);

  // Reset input so same file can be selected again
  e.target.value = null;
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


  // generate sharing object from sharingOptions
  const buildSharingObject = () => {
    const sharingObject = {};
    sharingOptions.forEach((opt) => {
      if (opt.type && opt.price) sharingObject[opt.type] = Number(opt.price);
    });
    return sharingObject;
  };


  const generateRoomNumbers = (floors, roomsPerFloor, startingNumber) => {
  const roomNumbers = [];

  const startNum = parseInt(startingNumber);
  const baseFloor = Math.floor(startNum / 100); // 101 -> 1
  const roomStart = startNum % 100; // 101 -> 1

  for (let floor = 0; floor < floors; floor++) {
    const currentFloor = baseFloor + floor;

    for (let room = 0; room < roomsPerFloor; room++) {
      const roomNo = currentFloor * 100 + (roomStart + room);
      roomNumbers.push({
        roomNo: roomNo,
        occupied: false
      });
    }
  }

  return roomNumbers;
};


  // ================== handleSubmit ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pgName || !pgInfo || !selectedPgType ) {
      alert("Please fill all required fields before saving.");
      return;
    }

    
if (!numFloors || !roomsPerFloor || !startingRoomNumber) {
  alert("Please fill floor and room details");
  return;
}


const generatedRooms = generateRoomNumbers(
  parseInt(numFloors),
  parseInt(roomsPerFloor),
  parseInt(startingRoomNumber)
);
    setLoading(true);
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

      // owner (use fetched owner or ownerId from props)
 
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

formData.append("roomNumbers", JSON.stringify(generatedRooms));


      // add image files if any
      pgImageFiles.forEach((file) => {
        formData.append("images", file); // backend should accept images as 'images' multiple
      });

      // Post to your original endpoint
      const res = await api.post("/hostel/addhostel", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("PG Uploaded Successfully!");
console.log("PG Saved:", res.data);

      // reset form values
      setPgName("");
      setPgInfo("");
      setSelectedPgType("");
      setSelectedRules([]);
      setSelectedFurnish([]);
      setPgImages([]);
      setPgImageFiles([]);
      setPgLocation({
        address: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
      });
      setSharingOptions([{ type: "", price: "" }]);
    } catch (err) {
      console.error("PG upload error:", err);
      alert("Failed to upload PG");
    } finally {
      setLoading(false);
    }
  };

  // small helpers for sharing options UI
  const addSharingRow = () => setSharingOptions((prev) => [...prev, { type: "", price: "" }]);
  const removeSharingRow = (index) => setSharingOptions((prev) => prev.filter((_, i) => i !== index));
const handleRemoveImage = (index) => {
  URL.revokeObjectURL(pgImages[index]); // release memory

  setPgImages((prev) => prev.filter((_, i) => i !== index));
  setPgImageFiles((prev) => prev.filter((_, i) => i !== index));
};
  return (
    <div className="uploadpg-container">
      <h3 className="page-title">Upload PG</h3>

      <form className="pg-form" onSubmit={handleSubmit}>
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
          {/* STATE */}
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

          {/* CITY */}
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

          {/* AREA */}
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
    <div key={i} className="pg-image-wrapper">
      <img src={img} alt={`PG ${i}`} />
      <button
        type="button"
        className="remove-image-btn"
        onClick={() => handleRemoveImage(i)}
      >
        ❌
      </button>
    </div>
  ))}

  {pgImages.length < 5 && (
    <label className="upload-btn">
      +
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
    </label>
  )}
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
              {days.map((day) => (
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
              if (newRule) setRules((prev) => [...prev, { name: newRule, icon: <FaPlus /> }]);
            }}
          >
            <FaPlus />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Upload PG"}
        </button>
      </form>

      </div>
  );
};

export default UploadPG;
