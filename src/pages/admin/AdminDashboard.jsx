import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
 
import api from "../../api";
 
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./AdminDashboard.css";
 
const revenueData = [
  { name: "27 Sep", revenue: 2000 },
  { name: "28 Sep", revenue: 3500 },
  { name: "29 Sep", revenue: 5000 },
  { name: "30 Sep", revenue: 2500 },
  { name: "1 Oct", revenue: 4200 },
  { name: "2 Oct", revenue: 3000 },
  { name: "3 Oct", revenue: 6000 },
];
 
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
 
  useEffect(() => {
        const fetchDashboard = async () => {
 
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
 
   try {
        const res = await api.get("/api/admin/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
 
        setStats(res.data);
      } catch (error) {
        console.error("Dashboard Error:", error);
 
        // If token expired or invalid → logout
        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminData");
          navigate("/admin/login");
        }
      }
        }
  }, [navigate]);
 
  const calculateGrowth = (today, week) => {
    const previous = week - today;
    if (previous <= 0) return "0.0";
    return ((today / previous) * 100).toFixed(1);
  };
 
  const getGrowthClass = (today) => {
    return today > 0 ? "growth positive" : "growth negative";
  };
 
  return (
    <div className="admin-dashboard">
      <div className="main-content">
        <div className="topbar">
          <h1>Admin Dashboard</h1>
        </div>
 
        {/* ===== Stats Cards ===== */}
        <div className="stats">
 
          {/* USERS CARD */}
          <div className="card modern">
            <h4>Total Registered Users</h4>
            <h2>{stats?.totalUsers || 0}</h2>
 
            {stats && (
              <>
                <p className="sub-info">
                  Today: {stats.todayUsers} | Week: {stats.weekUsers}
                </p>
                <span className={getGrowthClass(stats.todayUsers)}>
                  {calculateGrowth(
                    stats.todayUsers,
                    stats.weekUsers
                  )}% {stats.todayUsers > 0 ? "↑" : "↓"} this week
                </span>
              </>
            )}
          </div>
 
          {/* OWNERS CARD */}
          <div className="card modern">
            <h4>Total Registered Owners</h4>
            <h2>{stats?.totalOwners || 0}</h2>
 
            {stats && (
              <>
                <p className="sub-info">
                  Today: {stats.todayOwners} | Week: {stats.weekOwners}
                </p>
                <span className={getGrowthClass(stats.todayOwners)}>
                  {calculateGrowth(
                    stats.todayOwners,
                    stats.weekOwners
                  )}% {stats.todayOwners > 0 ? "↑" : "↓"} this week
                </span>
              </>
            )}
          </div>
        </div>
 
        {/* ===== Revenue Chart ===== */}
        <div className="chart-section">
          <h3>Revenue Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6C63FF"
                fill="#6C63FF"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
 
export default AdminDashboard;
