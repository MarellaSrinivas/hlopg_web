import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaUserTie, FaMoneyBill } from "react-icons/fa";
import "./AdminLayout.css";
import { FaBuilding } from "react-icons/fa";
 
const AdminLayout = () => {
  const location = useLocation();
 
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 className="logo">Hlopg</h2>
 
        <ul>
          <li className={location.pathname === "/admin" ? "active" : ""}>
            <Link to="/admin">
              <FaHome /> Dashboard
            </Link>
          </li>
 
          <li className={location.pathname.includes("/admin/users") ? "active" : ""}>
            <Link to="/admin/users">
              <FaUsers /> Users
            </Link>
          </li>
 
          <li>
            <Link to="/admin/owners">
              <FaUserTie /> Owners
            </Link>
          </li>


          <li className={location.pathname.includes("/admin/hostels") ? "active" : ""}>
  <Link to="/admin/hostels">
    <FaBuilding /> Hostels
  </Link>
</li>
 
          {/* <li>
            <Link to="/admin/payments">
              <FaMoneyBill /> Payments
            </Link>
          </li> */}
        </ul>
      </div>
 
      {/* Main Content */}
      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-title">Super Admin Dashboard</div>
          <div className="admin-profile">
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
            />
          </div>
        </div>
 
        {/* Dynamic Content Here */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
 
export default AdminLayout;