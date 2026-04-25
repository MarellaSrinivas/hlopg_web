// // // // // // src/pages/PaymentsList.jsx
// // // // // import React, { useEffect, useState } from "react";
// // // // // import api from "../api";
// // // // // import "./PaymentsList.css";

// // // // // const PaymentsList = () => {
// // // // //   const token = localStorage.getItem("hlopgToken");

// // // // //   const [payments, setPayments] = useState(null); // 🔑 null = not fetched
// // // // //   const [loading, setLoading] = useState(true);

// // // // //   /* ================= FETCH PAYMENTS ================= */
// // // // //   useEffect(() => {
// // // // //     const fetchPayments = async () => {
// // // // //       try {
// // // // //         const res = await api.get("/payments/owner", {
// // // // //           headers: { Authorization: `Bearer ${token}` },
// // // // //         });

// // // // //         setPayments(res.data?.data || []);
// // // // //       } catch (err) {
// // // // //         console.warn("Payments API not ready yet");
// // // // //         setPayments(null); // 🔑 keep UI alive
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     };

// // // // //     fetchPayments();
// // // // //   }, [token]);

// // // // //   /* ================= UPDATE PAYMENT STATUS ================= */
// // // // //   const togglePaymentStatus = async (paymentId, currentStatus) => {
// // // // //     try {
// // // // //       const newStatus = currentStatus === "paid" ? "pending" : "paid";

// // // // //       await api.put(
// // // // //         `/payments/${paymentId}/status`,
// // // // //         { status: newStatus },
// // // // //         {
// // // // //           headers: { Authorization: `Bearer ${token}` },
// // // // //         }
// // // // //       );

// // // // //       // 🔥 Instant UI update (optimistic update)
// // // // //       setPayments((prev) =>
// // // // //         prev.map((p) =>
// // // // //           p.payment_id === paymentId
// // // // //             ? { ...p, status: newStatus }
// // // // //             : p
// // // // //         )
// // // // //       );
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       alert("Failed to update payment status. Please try again.");
// // // // //     }
// // // // //   };

// // // // //   /* ================= TOTAL ================= */
// // // // //   const totalAmount =
// // // // //     payments?.reduce(
// // // // //       (sum, p) => sum + Number(p.amount || 0),
// // // // //       0
// // // // //     ) || 0;

// // // // //   return (
// // // // //     <div className="payments-container">
// // // // //       <div className="payments-header">
// // // // //         <h2>💳 Payments List</h2>
// // // // //       </div>

// // // // //       {/* Loading */}
// // // // //       {loading && <p>Loading payments…</p>}

// // // // //       {/* API Not Ready */}
// // // // //       {!loading && payments === null && (
// // // // //         <p>Data needs to be fetched</p>
// // // // //       )}

// // // // //       {/* No Payments */}
// // // // //       {!loading && payments?.length === 0 && (
// // // // //         <p>No payments found</p>
// // // // //       )}

// // // // //       {/* Payments Table */}
// // // // //       {!loading && payments?.length > 0 && (
// // // // //         <>
// // // // //           <table className="payments-table">
// // // // //             <thead>
// // // // //               <tr>
// // // // //                 <th>Name</th>
// // // // //                 <th>Date</th>
// // // // //                 <th>Sharing</th>
// // // // //                 <th>Amount</th>
// // // // //                 <th>Status</th>
// // // // //                 <th>Change</th>
// // // // //               </tr>
// // // // //             </thead>
// // // // //             <tbody>
// // // // //               {payments.map((p) => (
// // // // //                 <tr key={p.payment_id}>
// // // // //                   <td>{p.name || "-"}</td>
// // // // //                   <td>
// // // // //                     {p.payment_date
// // // // //                       ? new Date(p.payment_date).toLocaleDateString()
// // // // //                       : "-"}
// // // // //                   </td>
// // // // //                   <td>{p.sharing_type || "-"}</td>
// // // // //                   <td>₹ {Number(p.amount || 0).toLocaleString()}</td>
// // // // //                   <td>
// // // // //                     <span
// // // // //                       className={`status-badge ${
// // // // //                         p.status === "paid" ? "paid" : "pending"
// // // // //                       }`}
// // // // //                     >
// // // // //                       {p.status}
// // // // //                     </span>
// // // // //                   </td>
// // // // //                   <td>
// // // // //                     <button
// // // // //                       className={`status-toggle-btn ${
// // // // //                         p.status === "paid"
// // // // //                           ? "btn-paid"
// // // // //                           : "btn-pending"
// // // // //                       }`}
// // // // //                       onClick={() =>
// // // // //                         togglePaymentStatus(p.payment_id, p.status)
// // // // //                       }
// // // // //                     >
// // // // //                       {p.status === "paid"
// // // // //                         ? "Mark Pending"
// // // // //                         : "Mark Paid"}
// // // // //                     </button>
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               ))}
// // // // //             </tbody>
// // // // //           </table>

// // // // //           {/* TOTAL */}
// // // // //           <div className="payments-total">
// // // // //             Total: ₹ {totalAmount.toLocaleString()}
// // // // //           </div>
// // // // //         </>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default PaymentsList;

// // // // // src/pages/PaymentsList.jsx
// // // // import React, { useEffect, useState } from "react";
// // // // import api from "../api";
// // // // import "./PaymentsList.css";

// // // // const PaymentsList = () => {
// // // //   const token = localStorage.getItem("hlopgToken");

// // // //   const [payments, setPayments] = useState(null); // 🔑 null = not fetched
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState(null);

// // // //   /* ================= FETCH PAYMENTS ================= */
// // // //   useEffect(() => {
// // // //     const fetchPayments = async () => {
// // // //       try {
// // // //         setLoading(true);
// // // //         setError(null);
        
// // // //         const res = await api.get("/payments/owner", {
// // // //           headers: { 
// // // //             Authorization: `Bearer ${token}`,
// // // //             'Content-Type': 'application/json'
// // // //           },
// // // //         });

// // // //         console.log("Payments API response:", res.data);
        
// // // //         if (res.data.success) {
// // // //           setPayments(res.data?.data || []);
// // // //         } else {
// // // //           setError("Failed to fetch payments");
// // // //           setPayments([]);
// // // //         }
// // // //       } catch (err) {
// // // //         console.error("Payments fetch error:", err);
// // // //         setError(err.response?.data?.message || "Failed to fetch payments");
// // // //         setPayments([]);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     if (token) {
// // // //       fetchPayments();
// // // //     } else {
// // // //       setError("No authentication token found");
// // // //       setLoading(false);
// // // //     }
// // // //   }, [token]);

// // // //   /* ================= UPDATE PAYMENT STATUS ================= */
// // // //   const togglePaymentStatus = async (paymentId, currentStatus) => {
// // // //     if (!paymentId || !currentStatus) {
// // // //       alert("Invalid payment data");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const newStatus = currentStatus === "paid" ? "pending" : "paid";

// // // //       const response = await api.put(
// // // //         `/payments/${paymentId}/status`,
// // // //         { status: newStatus },
// // // //         {
// // // //           headers: { 
// // // //             Authorization: `Bearer ${token}`,
// // // //             'Content-Type': 'application/json'
// // // //           },
// // // //         }
// // // //       );

// // // //       console.log("Status update response:", response.data);
      
// // // //       if (response.data.success) {
// // // //         // 🔥 Instant UI update (optimistic update)
// // // //         setPayments((prev) =>
// // // //           prev.map((p) =>
// // // //             p.payment_id === paymentId
// // // //               ? { ...p, status: newStatus }
// // // //               : p
// // // //           )
// // // //         );
// // // //       } else {
// // // //         alert("Failed to update payment status on server");
// // // //       }
// // // //     } catch (err) {
// // // //       console.error("Status update error:", err);
// // // //       alert(err.response?.data?.message || "Failed to update payment status. Please try again.");
// // // //     }
// // // //   };

// // // //   /* ================= TOTAL ================= */
// // // //   const totalAmount =
// // // //     payments?.reduce(
// // // //       (sum, p) => sum + Number(p.amount || 0),
// // // //       0
// // // //     ) || 0;

// // // //   return (
// // // //     <div className="payments-container">
// // // //       <div className="payments-header">
// // // //         <h2>💳 Payments List</h2>
// // // //       </div>

// // // //       {/* Loading */}
// // // //       {loading && (
// // // //         <div className="loading-state">
// // // //           <p>Loading payments…</p>
// // // //           <div className="loading-spinner"></div>
// // // //         </div>
// // // //       )}

// // // //       {/* Error State */}
// // // //       {error && !loading && (
// // // //         <div className="error-state">
// // // //           <p>⚠️ {error}</p>
// // // //           <button 
// // // //             onClick={() => window.location.reload()}
// // // //             className="retry-btn"
// // // //           >
// // // //             Retry
// // // //           </button>
// // // //         </div>
// // // //       )}

// // // //       {/* API Not Ready */}
// // // //       {!loading && !error && payments === null && (
// // // //         <p>Data needs to be fetched</p>
// // // //       )}

// // // //       {/* No Payments */}
// // // //       {!loading && !error && payments?.length === 0 && (
// // // //         <p>No payments found</p>
// // // //       )}

// // // //       {/* Payments Table */}
// // // //       {!loading && !error && payments?.length > 0 && (
// // // //         <>
// // // //           <div className="payments-summary">
// // // //             <span>Total Payments: {payments.length}</span>
// // // //             <span>Pending: {payments.filter(p => p.status === 'pending').length}</span>
// // // //           </div>
          
// // // //           <table className="payments-table">
// // // //             <thead>
// // // //               <tr>
// // // //                 <th>Payment ID</th>
// // // //                 <th>Name</th>
// // // //                 <th>Date</th>
// // // //                 <th>Sharing</th>
// // // //                 <th>Amount</th>
// // // //                 <th>Status</th>
// // // //                 <th>Action</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {payments.map((p) => (
// // // //                 <tr key={p.payment_id}>
// // // //                   <td className="payment-id">{p.payment_id}</td>
// // // //                   <td>{p.name || "-"}</td>
// // // //                   <td>
// // // //                     {p.payment_date
// // // //                       ? new Date(p.payment_date).toLocaleDateString('en-IN')
// // // //                       : "-"}
// // // //                   </td>
// // // //                   <td>{p.sharing_type || "-"}</td>
// // // //                   <td>₹ {Number(p.amount || 0).toLocaleString('en-IN')}</td>
// // // //                   <td>
// // // //                     <span
// // // //                       className={`status-badge ${
// // // //                         p.status === "paid" ? "paid" : "pending"
// // // //                       }`}
// // // //                     >
// // // //                       {p.status}
// // // //                     </span>
// // // //                   </td>
// // // //                   <td>
// // // //                     <button
// // // //                       className={`status-toggle-btn ${
// // // //                         p.status === "paid"
// // // //                           ? "btn-paid"
// // // //                           : "btn-pending"
// // // //                       }`}
// // // //                       onClick={() =>
// // // //                         togglePaymentStatus(p.payment_id, p.status)
// // // //                       }
// // // //                     >
// // // //                       {p.status === "paid"
// // // //                         ? "Mark Pending"
// // // //                         : "Mark Paid"}
// // // //                     </button>
// // // //                   </td>
// // // //                 </tr>
// // // //               ))}
// // // //             </tbody>
// // // //           </table>

// // // //           {/* TOTAL */}
// // // //           <div className="payments-total">
// // // //             Total Amount: ₹ {totalAmount.toLocaleString('en-IN')}
// // // //           </div>
// // // //         </>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default PaymentsList;

// // // // src/pages/PaymentsList.jsx
// // // import React, { useEffect, useState } from "react";
// // // import api from "../api";
// // // import "./PaymentsList.css";

// // // const PaymentsList = () => {
// // //   const token = localStorage.getItem("hlopgToken");

// // //   const [payments, setPayments] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [summary, setSummary] = useState(null);
  
// // //   const [showAddForm, setShowAddForm] = useState(false);
// // //   const [newPayment, setNewPayment] = useState({
// // //     name: "",
// // //     amount: "",
// // //     paymentDate: new Date().toISOString().split('T')[0],
// // //     sharingType: "Single Sharing",
// // //     status: "pending",
// // //     notes: ""
// // //   });

// // //   const [editMode, setEditMode] = useState(false);
// // //   const [editingPayment, setEditingPayment] = useState(null);

// // //   // Fetch payments data
// // //   const fetchPaymentsData = async () => {
// // //     if (!token) {
// // //       setError("Please login first");
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);
// // //       setError(null);
      
// // //       // Fetch payments
// // //       const paymentsRes = await api.get("/payments/owner", {
// // //         headers: { 
// // //           Authorization: `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         },
// // //       });

// // //       if (paymentsRes.data.success) {
// // //         setPayments(paymentsRes.data.data || []);
        
// // //         // Fetch summary
// // //         const summaryRes = await api.get("/payments/summary", {
// // //           headers: { 
// // //             Authorization: `Bearer ${token}`,
// // //             'Content-Type': 'application/json'
// // //           },
// // //         });
        
// // //         if (summaryRes.data.success) {
// // //           setSummary(summaryRes.data.data);
// // //         }
// // //       } else {
// // //         setError(paymentsRes.data.message || "Failed to fetch payments");
// // //       }
// // //     } catch (err) {
// // //       console.error("API Error:", err);
// // //       if (err.response?.status === 401) {
// // //         setError("Session expired. Please login again.");
// // //         localStorage.removeItem("hlopgToken");
// // //         window.location.href = "/login";
// // //       } else {
// // //         setError(err.response?.data?.message || "Failed to connect to server");
// // //       }
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchPaymentsData();
// // //   }, [token]);

// // //   // Update payment status
// // //   const togglePaymentStatus = async (paymentId, currentStatus) => {
// // //     if (!token) {
// // //       alert("Please login first");
// // //       return;
// // //     }

// // //     try {
// // //       const newStatus = currentStatus === "paid" ? "pending" : "paid";

// // //       const response = await api.put(
// // //         `/payments/${paymentId}/status`,
// // //         { status: newStatus },
// // //         {
// // //           headers: { 
// // //             Authorization: `Bearer ${token}`,
// // //             'Content-Type': 'application/json'
// // //           },
// // //         }
// // //       );

// // //       if (response.data.success) {
// // //         // Update local state
// // //         setPayments(prev =>
// // //           prev.map(payment =>
// // //             payment.paymentId === paymentId
// // //               ? { ...payment, status: newStatus }
// // //               : payment
// // //           )
// // //         );
        
// // //         // Refresh summary
// // //         fetchPaymentsData();
        
// // //         alert(`Payment marked as ${newStatus}!`);
// // //       } else {
// // //         alert(response.data.message || "Failed to update status");
// // //       }
// // //     } catch (err) {
// // //       console.error("Update Error:", err);
// // //       alert(err.response?.data?.message || "Failed to update payment status");
// // //     }
// // //   };

// // //   // Add new payment
// // //   const handleAddPayment = async (e) => {
// // //     e.preventDefault();
    
// // //     if (!token) {
// // //       alert("Please login first");
// // //       return;
// // //     }

// // //     if (!newPayment.name.trim() || !newPayment.amount) {
// // //       alert("Please fill all required fields");
// // //       return;
// // //     }

// // //     try {
// // //       const response = await api.post(
// // //         "/payments/create",
// // //         newPayment,
// // //         {
// // //           headers: { 
// // //             Authorization: `Bearer ${token}`,
// // //             'Content-Type': 'application/json'
// // //           },
// // //         }
// // //       );

// // //       if (response.data.success) {
// // //         // Reset form
// // //         setNewPayment({
// // //           name: "",
// // //           amount: "",
// // //           paymentDate: new Date().toISOString().split('T')[0],
// // //           sharingType: "Single Sharing",
// // //           status: "pending",
// // //           notes: ""
// // //         });
// // //         setShowAddForm(false);
        
// // //         // Refresh data
// // //         fetchPaymentsData();
        
// // //         alert("Payment added successfully!");
// // //       } else {
// // //         alert(response.data.message || "Failed to add payment");
// // //       }
// // //     } catch (err) {
// // //       console.error("Add Error:", err);
// // //       alert(err.response?.data?.message || "Failed to add payment");
// // //     }
// // //   };

// // //   // Edit payment
// // //   const handleEditPayment = (payment) => {
// // //     setEditMode(true);
// // //     setEditingPayment(payment);
// // //     setNewPayment({
// // //       name: payment.tenantName,
// // //       amount: payment.amount,
// // //       paymentDate: payment.paymentDate || new Date().toISOString().split('T')[0],
// // //       sharingType: payment.sharingType || "Single Sharing",
// // //       status: payment.status,
// // //       notes: payment.notes || ""
// // //     });
// // //     setShowAddForm(true);
// // //   };

// // //   // Update payment
// // //   const handleUpdatePayment = async (e) => {
// // //     e.preventDefault();
    
// // //     if (!token || !editingPayment) {
// // //       return;
// // //     }

// // //     try {
// // //       const response = await api.put(
// // //         `/payments/${editingPayment.paymentId}`,
// // //         newPayment,
// // //         {
// // //           headers: { 
// // //             Authorization: `Bearer ${token}`,
// // //             'Content-Type': 'application/json'
// // //           },
// // //         }
// // //       );

// // //       if (response.data.success) {
// // //         // Reset form
// // //         setEditMode(false);
// // //         setEditingPayment(null);
// // //         setNewPayment({
// // //           name: "",
// // //           amount: "",
// // //           paymentDate: new Date().toISOString().split('T')[0],
// // //           sharingType: "Single Sharing",
// // //           status: "pending",
// // //           notes: ""
// // //         });
// // //         setShowAddForm(false);
        
// // //         // Refresh data
// // //         fetchPaymentsData();
        
// // //         alert("Payment updated successfully!");
// // //       } else {
// // //         alert(response.data.message || "Failed to update payment");
// // //       }
// // //     } catch (err) {
// // //       console.error("Update Error:", err);
// // //       alert(err.response?.data?.message || "Failed to update payment");
// // //     }
// // //   };

// // //   // Delete payment
// // //   const handleDeletePayment = async (paymentId) => {
// // //     if (!window.confirm("Are you sure you want to delete this payment?")) {
// // //       return;
// // //     }

// // //     try {
// // //       const response = await api.delete(`/payments/${paymentId}`, {
// // //         headers: { 
// // //           Authorization: `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         },
// // //       });

// // //       if (response.data.success) {
// // //         // Refresh data
// // //         fetchPaymentsData();
// // //         alert("Payment deleted successfully!");
// // //       } else {
// // //         alert(response.data.message || "Failed to delete payment");
// // //       }
// // //     } catch (err) {
// // //       console.error("Delete Error:", err);
// // //       alert(err.response?.data?.message || "Failed to delete payment");
// // //     }
// // //   };

// // //   // Format currency
// // //   const formatCurrency = (amount) => {
// // //     return new Intl.NumberFormat('en-IN', {
// // //       style: 'currency',
// // //       currency: 'INR',
// // //       minimumFractionDigits: 0,
// // //       maximumFractionDigits: 2
// // //     }).format(amount);
// // //   };

// // //   // Format date
// // //   const formatDate = (dateString) => {
// // //     if (!dateString) return "N/A";
// // //     return new Date(dateString).toLocaleDateString('en-IN', {
// // //       day: '2-digit',
// // //       month: 'short',
// // //       year: 'numeric'
// // //     });
// // //   };

// // //   return (
// // //     <div className="payments-container">
// // //       <div className="payments-header">
// // //         <h2>💳 Payments Management</h2>
// // //         <div className="header-actions">
// // //           <button 
// // //             className="refresh-btn"
// // //             onClick={fetchPaymentsData}
// // //             disabled={loading}
// // //           >
// // //             {loading ? "Refreshing..." : "🔄 Refresh"}
// // //           </button>
// // //           <button 
// // //             className="add-payment-btn"
// // //             onClick={() => {
// // //               setEditMode(false);
// // //               setEditingPayment(null);
// // //               setShowAddForm(!showAddForm);
// // //             }}
// // //           >
// // //             {showAddForm ? "✕ Cancel" : "+ Add New Payment"}
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Add/Edit Payment Form */}
// // //       {(showAddForm || editMode) && (
// // //         <form className="add-payment-form" onSubmit={editMode ? handleUpdatePayment : handleAddPayment}>
// // //           <h3>{editMode ? "Edit Payment" : "Add New Payment"}</h3>
          
// // //           <div className="form-row">
// // //             <div className="form-group">
// // //               <label>Tenant Name *</label>
// // //               <input
// // //                 type="text"
// // //                 placeholder="Enter tenant name"
// // //                 value={newPayment.name}
// // //                 onChange={(e) => setNewPayment({...newPayment, name: e.target.value})}
// // //                 required
// // //               />
// // //             </div>
            
// // //             <div className="form-group">
// // //               <label>Amount (₹) *</label>
// // //               <input
// // //                 type="number"
// // //                 placeholder="Enter amount"
// // //                 value={newPayment.amount}
// // //                 onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
// // //                 required
// // //                 min="0"
// // //                 step="100"
// // //               />
// // //             </div>
// // //           </div>
          
// // //           <div className="form-row">
// // //             <div className="form-group">
// // //               <label>Payment Date</label>
// // //               <input
// // //                 type="date"
// // //                 value={newPayment.paymentDate}
// // //                 onChange={(e) => setNewPayment({...newPayment, paymentDate: e.target.value})}
// // //                 required
// // //               />
// // //             </div>
            
// // //             <div className="form-group">
// // //               <label>Sharing Type</label>
// // //               <select
// // //                 value={newPayment.sharingType}
// // //                 onChange={(e) => setNewPayment({...newPayment, sharingType: e.target.value})}
// // //               >
// // //                 <option value="Single Sharing">Single Sharing</option>
// // //                 <option value="Double Sharing">Double Sharing</option>
// // //                 <option value="Triple Sharing">Triple Sharing</option>
// // //                 <option value="Other">Other</option>
// // //               </select>
// // //             </div>
// // //           </div>
          
// // //           <div className="form-row">
// // //             <div className="form-group">
// // //               <label>Status</label>
// // //               <select
// // //                 value={newPayment.status}
// // //                 onChange={(e) => setNewPayment({...newPayment, status: e.target.value})}
// // //               >
// // //                 <option value="pending">Pending</option>
// // //                 <option value="paid">Paid</option>
// // //               </select>
// // //             </div>
            
// // //             <div className="form-group">
// // //               <label>Notes (Optional)</label>
// // //               <input
// // //                 type="text"
// // //                 placeholder="Add notes"
// // //                 value={newPayment.notes}
// // //                 onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
// // //               />
// // //             </div>
// // //           </div>
          
// // //           <div className="form-actions">
// // //             <button type="submit" className="submit-btn">
// // //               {editMode ? "Update Payment" : "Add Payment"}
// // //             </button>
// // //             {editMode && (
// // //               <button 
// // //                 type="button"
// // //                 className="cancel-btn"
// // //                 onClick={() => {
// // //                   setEditMode(false);
// // //                   setEditingPayment(null);
// // //                   setShowAddForm(false);
// // //                 }}
// // //               >
// // //                 Cancel Edit
// // //               </button>
// // //             )}
// // //           </div>
// // //         </form>
// // //       )}

// // //       {/* Loading State */}
// // //       {loading && (
// // //         <div className="loading-state">
// // //           <div className="loading-spinner"></div>
// // //           <p>Loading payments data...</p>
// // //         </div>
// // //       )}

// // //       {/* Error State */}
// // //       {error && !loading && (
// // //         <div className="error-state">
// // //           <p>⚠️ {error}</p>
// // //           <button 
// // //             onClick={fetchPaymentsData}
// // //             className="retry-btn"
// // //           >
// // //             Retry
// // //           </button>
// // //           {error.includes("Session expired") && (
// // //             <button 
// // //               onClick={() => window.location.href = "/login"}
// // //               className="login-btn"
// // //             >
// // //               Login Again
// // //             </button>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* Summary Cards */}
// // //       {!loading && !error && summary && (
// // //         <div className="summary-cards">
// // //           <div className="summary-card total">
// // //             <h3>Total Amount</h3>
// // //             <p>{formatCurrency(summary.totalAmount)}</p>
// // //             <small>{summary.totalPayments} payments</small>
// // //           </div>
// // //           <div className="summary-card pending">
// // //             <h3>Pending</h3>
// // //             <p>{formatCurrency(summary.pendingAmount)}</p>
// // //             <small>{summary.pendingCount} payments</small>
// // //           </div>
// // //           <div className="summary-card paid">
// // //             <h3>Paid</h3>
// // //             <p>{formatCurrency(summary.paidAmount)}</p>
// // //             <small>{summary.paidCount} payments</small>
// // //           </div>
// // //           <div className="summary-card recent">
// // //             <h3>Recent Activity</h3>
// // //             <p>{payments.length > 0 ? formatDate(payments[0].paymentDate) : "No payments"}</p>
// // //             <small>Last payment date</small>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* No Payments */}
// // //       {!loading && !error && payments.length === 0 && (
// // //         <div className="empty-state">
// // //           <div className="empty-icon">📭</div>
// // //           <p>No payments found</p>
// // //           <p className="empty-subtext">Add your first payment to get started</p>
// // //           <button 
// // //             onClick={() => setShowAddForm(true)}
// // //             className="add-first-btn"
// // //           >
// // //             + Add First Payment
// // //           </button>
// // //         </div>
// // //       )}

// // //       {/* Payments Table */}
// // //       {!loading && !error && payments.length > 0 && (
// // //         <>
// // //           <div className="table-header">
// // //             <h3>All Payments ({payments.length})</h3>
// // //             <div className="table-actions">
// // //               <input 
// // //                 type="text" 
// // //                 placeholder="Search payments..." 
// // //                 className="search-input"
// // //               />
// // //               <select className="filter-select" defaultValue="all">
// // //                 <option value="all">All Status</option>
// // //                 <option value="pending">Pending Only</option>
// // //                 <option value="paid">Paid Only</option>
// // //               </select>
// // //             </div>
// // //           </div>

// // //           <div className="table-responsive">
// // //             <table className="payments-table">
// // //               <thead>
// // //                 <tr>
// // //                   <th>Payment ID</th>
// // //                   <th>Tenant Name</th>
// // //                   <th>Date</th>
// // //                   <th>Sharing</th>
// // //                   <th>Amount</th>
// // //                   <th>Status</th>
// // //                   <th>Actions</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {payments.map((payment) => (
// // //                   <tr key={payment.id}>
// // //                     <td className="payment-id">
// // //                       {payment.paymentId}
// // //                     </td>
// // //                     <td>
// // //                       <div className="tenant-info">
// // //                         <strong>{payment.tenantName}</strong>
// // //                         {payment.notes && <small>{payment.notes}</small>}
// // //                       </div>
// // //                     </td>
// // //                     <td>
// // //                       {formatDate(payment.paymentDate)}
// // //                     </td>
// // //                     <td>{payment.sharingType || "N/A"}</td>
// // //                     <td className="amount-cell">
// // //                       <strong>{formatCurrency(payment.amount)}</strong>
// // //                     </td>
// // //                     <td>
// // //                       <span
// // //                         className={`status-badge ${
// // //                           payment.status === "paid" ? "paid" : "pending"
// // //                         }`}
// // //                       >
// // //                         {payment.status}
// // //                       </span>
// // //                     </td>
// // //                     <td className="actions-cell">
// // //                       <button
// // //                         className={`status-toggle-btn ${
// // //                           payment.status === "paid"
// // //                             ? "btn-paid"
// // //                             : "btn-pending"
// // //                         }`}
// // //                         onClick={() =>
// // //                           togglePaymentStatus(payment.paymentId, payment.status)
// // //                         }
// // //                       >
// // //                         {payment.status === "paid"
// // //                           ? "Mark Pending"
// // //                           : "Mark Paid"}
// // //                       </button>
// // //                       <button
// // //                         className="edit-btn"
// // //                         onClick={() => handleEditPayment(payment)}
// // //                         title="Edit payment"
// // //                       >
// // //                         ✏️
// // //                       </button>
// // //                       <button
// // //                         className="delete-btn"
// // //                         onClick={() => handleDeletePayment(payment.paymentId)}
// // //                         title="Delete payment"
// // //                       >
// // //                         🗑️
// // //                       </button>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //           {/* Footer */}
// // //           <div className="table-footer">
// // //             <div className="footer-info">
// // //               Showing {payments.length} payments • 
// // //               Pending: {payments.filter(p => p.status === "pending").length} • 
// // //               Paid: {payments.filter(p => p.status === "paid").length}
// // //             </div>
// // //             <div className="footer-actions">
// // //               <button 
// // //                 className="export-btn"
// // //                 onClick={() => alert("Export functionality coming soon!")}
// // //               >
// // //                 📥 Export to Excel
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default PaymentsList;

// // // src/pages/PaymentsList.jsx
// // import React, { useEffect, useState } from "react";
// // import api from "../api";
// // import "./PaymentsList.css";

// // const PaymentsList = () => {
// //   const [payments, setPayments] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
  
// //   const [showAddForm, setShowAddForm] = useState(false);
// //   const [newPayment, setNewPayment] = useState({
// //     tenantName: "",
// //     amount: "",
// //     paymentDate: new Date().toISOString().split('T')[0],
// //     status: "pending"
// //   });

// //   // Get token
// //   const getToken = () => {
// //     return localStorage.getItem("hlopgToken");
// //   };

// //   // Fetch payments
// //   // Update your frontend to log more details
// // const fetchPayments = async () => {
// //   const token = getToken();
  
// //   if (!token) {
// //     setError("Please login first");
// //     setLoading(false);
// //     return;
// //   }

// //   try {
// //     setLoading(true);
// //     setError(null);
    
// //     console.log("🔑 Token being sent:", token.substring(0, 30) + "...");
    
// //     const response = await api.get("/payments/owner", {
// //       headers: { 
// //         Authorization: `Bearer ${token}`
// //       },
// //     });

// //     console.log("✅ Response:", response.data);
    
// //     if (response.data.success) {
// //       setPayments(response.data.data || []);
// //     } else {
// //       setError(response.data.message);
// //     }
// //   } catch (err) {
// //     console.error("❌ Error details:", {
// //       status: err.response?.status,
// //       data: err.response?.data,
// //       message: err.message,
// //       config: {
// //         url: err.config?.url,
// //         headers: err.config?.headers
// //       }
// //     });
// //     setError(err.response?.data?.message || "Failed to fetch payments");
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   useEffect(() => {
// //     fetchPayments();
// //   }, []);

// //   // Update payment status
// //   const togglePaymentStatus = async (paymentId, currentStatus) => {
// //     const token = getToken();
    
// //     if (!token) {
// //       alert("Please login first");
// //       return;
// //     }

// //     try {
// //       const newStatus = currentStatus === "paid" ? "pending" : "paid";
      
// //       const response = await api.put(
// //         `/payments/${paymentId}/status`,
// //         { status: newStatus },
// //         {
// //           headers: { 
// //             Authorization: `Bearer ${token}`
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         // Update local state
// //         setPayments(prev =>
// //           prev.map(payment =>
// //             payment.paymentId === paymentId
// //               ? { ...payment, status: newStatus }
// //               : payment
// //           )
// //         );
// //         alert("Status updated!");
// //       }
// //     } catch (err) {
// //       alert(err.response?.data?.message || "Failed to update status");
// //     }
// //   };

// //   // Add new payment
// //   const handleAddPayment = async (e) => {
// //     e.preventDefault();
    
// //     const token = getToken();
    
// //     if (!token) {
// //       alert("Please login first");
// //       return;
// //     }

// //     if (!newPayment.tenantName.trim() || !newPayment.amount) {
// //       alert("Please fill all fields");
// //       return;
// //     }

// //     try {
// //       const response = await api.post(
// //         "/payments/create",
// //         {
// //           tenantName: newPayment.tenantName,
// //           amount: parseFloat(newPayment.amount),
// //           paymentDate: newPayment.paymentDate,
// //           status: newPayment.status
// //         },
// //         {
// //           headers: { 
// //             Authorization: `Bearer ${token}`
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         // Add to list
// //         setPayments(prev => [response.data.data, ...prev]);
        
// //         // Reset form
// //         setNewPayment({
// //           tenantName: "",
// //           amount: "",
// //           paymentDate: new Date().toISOString().split('T')[0],
// //           status: "pending"
// //         });
// //         setShowAddForm(false);
        
// //         alert("Payment added!");
// //       }
// //     } catch (err) {
// //       alert(err.response?.data?.message || "Failed to add payment");
// //     }
// //   };

// //   // Calculate total
// //   const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

// //   return (
// //     <div className="payments-container">
// //       <div className="payments-header">
// //         <h2>💳 Payments</h2>
// //         <button 
// //           className="add-payment-btn"
// //           onClick={() => setShowAddForm(!showAddForm)}
// //         >
// //           {showAddForm ? "Cancel" : "+ Add Payment"}
// //         </button>
// //       </div>

// //       {/* Add Form */}
// //       {showAddForm && (
// //         <form className="add-payment-form" onSubmit={handleAddPayment}>
// //           <input
// //             type="text"
// //             placeholder="Tenant Name *"
// //             value={newPayment.tenantName}
// //             onChange={(e) => setNewPayment({...newPayment, tenantName: e.target.value})}
// //             required
// //           />
// //           <input
// //             type="number"
// //             placeholder="Amount *"
// //             value={newPayment.amount}
// //             onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
// //             required
// //             min="0"
// //           />
// //           <input
// //             type="date"
// //             value={newPayment.paymentDate}
// //             onChange={(e) => setNewPayment({...newPayment, paymentDate: e.target.value})}
// //           />
// //           <select
// //             value={newPayment.status}
// //             onChange={(e) => setNewPayment({...newPayment, status: e.target.value})}
// //           >
// //             <option value="pending">Pending</option>
// //             <option value="paid">Paid</option>
// //           </select>
// //           <button type="submit" className="submit-btn">
// //             Add Payment
// //           </button>
// //         </form>
// //       )}

// //       {/* Loading */}
// //       {loading && <p>Loading payments...</p>}

// //       {/* Error */}
// //       {error && !loading && (
// //         <div className="error">
// //           <p>{error}</p>
// //           <button onClick={fetchPayments}>Retry</button>
// //         </div>
// //       )}

// //       {/* Payments Table */}
// //       {!loading && !error && (
// //         <>
// //           {payments.length === 0 ? (
// //             <p>No payments found</p>
// //           ) : (
// //             <>
// //               <table className="payments-table">
// //                 <thead>
// //                   <tr>
// //                     <th>Tenant</th>
// //                     <th>Date</th>
// //                     <th>Amount</th>
// //                     <th>Status</th>
// //                     <th>Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {payments.map((payment) => (
// //                     <tr key={payment.paymentId || payment.id}>
// //                       <td>{payment.tenantName}</td>
// //                       <td>
// //                         {payment.paymentDate 
// //                           ? new Date(payment.paymentDate).toLocaleDateString()
// //                           : "-"}
// //                       </td>
// //                       <td>₹{payment.amount}</td>
// //                       <td>
// //                         <span className={`status ${payment.status}`}>
// //                           {payment.status}
// //                         </span>
// //                       </td>
// //                       <td>
// //                         <button
// //                           className="status-btn"
// //                           onClick={() => togglePaymentStatus(payment.paymentId, payment.status)}
// //                         >
// //                           Mark {payment.status === "paid" ? "Pending" : "Paid"}
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
              
// //               <div className="total">
// //                 Total: ₹{totalAmount.toLocaleString()}
// //               </div>
// //             </>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default PaymentsList;

// // src/pages/PaymentsList.jsx
// import React, { useEffect, useState } from "react";
// import api from "../api";
// import "./PaymentsList.css";

// const PaymentsList = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [debugInfo, setDebugInfo] = useState(null);
  
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newPayment, setNewPayment] = useState({
//     tenantName: "",
//     amount: "",
//     paymentDate: new Date().toISOString().split('T')[0],
//     status: "pending"
//   });

//   // Get token
//   const getToken = () => {
//     const token = localStorage.getItem("hlopgToken");
//     console.log("🔑 Token from localStorage:", token);
//     return token;
//   };

//   // First, test the token parsing
//   const testToken = async () => {
//     const token = getToken();
    
//     if (!token) {
//       setError("No token found in localStorage");
//       return;
//     }

//     try {
//       console.log("🧪 Testing token parsing...");
//       const response = await api.get("/payments/test-token", {
//         headers: { 
//           Authorization: token // Send token directly, not with Bearer prefix
//         },
//       });
      
//       console.log("✅ Token test result:", response.data);
//       setDebugInfo(response.data);
      
//       return response.data.success;
//     } catch (err) {
//       console.error("❌ Token test error:", err.response?.data || err.message);
//       setDebugInfo({
//         error: err.response?.data || err.message,
//         status: err.response?.status
//       });
//       return false;
//     }
//   };

//   // Fetch payments
//   const fetchPayments = async () => {
//     const token = getToken();
    
//     if (!token) {
//       setError("Please login first");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log("📤 Fetching payments with token:", token.substring(0, 30) + "...");
      
//       // First test token
//       const tokenValid = await testToken();
//       if (!tokenValid) {
//         setError("Token validation failed. Please login again.");
//         setLoading(false);
//         return;
//       }
      
//       // Now fetch payments
//       const response = await api.get("/payments/owner", {
//         headers: { 
//           Authorization: token // IMPORTANT: Send token directly without "Bearer " prefix
//         },
//       });

//       console.log("✅ Payments API response:", response.data);
      
//       if (response.data.success) {
//         setPayments(response.data.data || []);
//       } else {
//         setError(response.data.message || "Failed to fetch payments");
//       }
//     } catch (err) {
//       console.error("❌ Error fetching payments:", {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//         config: err.config
//       });
//       setError(err.response?.data?.message || "Failed to fetch payments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   // Update payment status
//   const togglePaymentStatus = async (paymentId, currentStatus) => {
//     const token = getToken();
    
//     if (!token) {
//       alert("Please login first");
//       return;
//     }

//     try {
//       const newStatus = currentStatus === "paid" ? "pending" : "paid";
//       console.log(`🔄 Updating ${paymentId} to ${newStatus}`);
      
//       const response = await api.put(
//         `/payments/${paymentId}/status`,
//         { status: newStatus },
//         {
//           headers: { 
//             Authorization: token // Send token directly
//           },
//         }
//       );

//       if (response.data.success) {
//         // Update local state
//         setPayments(prev =>
//           prev.map(payment =>
//             payment.paymentId === paymentId
//               ? { ...payment, status: newStatus }
//               : payment
//           )
//         );
//         alert("Status updated!");
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//       alert(err.response?.data?.message || "Failed to update status");
//     }
//   };

//   // Add new payment
//   const handleAddPayment = async (e) => {
//     e.preventDefault();
    
//     const token = getToken();
    
//     if (!token) {
//       alert("Please login first");
//       return;
//     }

//     if (!newPayment.tenantName.trim() || !newPayment.amount) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       const paymentData = {
//         tenantName: newPayment.tenantName,
//         amount: parseFloat(newPayment.amount),
//         paymentDate: newPayment.paymentDate,
//         status: newPayment.status
//       };
      
//       console.log("➕ Creating payment:", paymentData);
      
//       const response = await api.post(
//         "/payments/create",
//         paymentData,
//         {
//           headers: { 
//             Authorization: token // Send token directly
//           },
//         }
//       );

//       if (response.data.success) {
//         // Add to list
//         setPayments(prev => [response.data.data, ...prev]);
        
//         // Reset form
//         setNewPayment({
//           tenantName: "",
//           amount: "",
//           paymentDate: new Date().toISOString().split('T')[0],
//           status: "pending"
//         });
//         setShowAddForm(false);
        
//         alert("Payment added!");
//       }
//     } catch (err) {
//       console.error("Add error:", err);
//       alert(err.response?.data?.message || "Failed to add payment");
//     }
//   };

//   // Calculate total
//   const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

//   return (
//     <div className="payments-container">
//       <div className="payments-header">
//         <h2>💳 Payments</h2>
//         <div style={{ display: "flex", gap: "10px" }}>
//           <button 
//             className="debug-btn"
//             onClick={testToken}
//           >
//             🧪 Test Token
//           </button>
//           <button 
//             className="add-payment-btn"
//             onClick={() => setShowAddForm(!showAddForm)}
//           >
//             {showAddForm ? "Cancel" : "+ Add Payment"}
//           </button>
//         </div>
//       </div>

//       {/* Debug Info */}
//       {debugInfo && (
//         <div className="debug-info" style={{
//           background: debugInfo.success ? "#e8f5e8" : "#ffebee",
//           padding: "15px",
//           borderRadius: "5px",
//           marginBottom: "20px",
//           fontSize: "14px"
//         }}>
//           <h4>🔧 Debug Info:</h4>
//           <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
//             {JSON.stringify(debugInfo, null, 2)}
//           </pre>
//         </div>
//       )}

//       {/* Add Form */}
//       {showAddForm && (
//         <form className="add-payment-form" onSubmit={handleAddPayment}>
//           <input
//             type="text"
//             placeholder="Tenant Name *"
//             value={newPayment.tenantName}
//             onChange={(e) => setNewPayment({...newPayment, tenantName: e.target.value})}
//             required
//           />
//           <input
//             type="number"
//             placeholder="Amount *"
//             value={newPayment.amount}
//             onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
//             required
//             min="0"
//           />
//           <input
//             type="date"
//             value={newPayment.paymentDate}
//             onChange={(e) => setNewPayment({...newPayment, paymentDate: e.target.value})}
//           />
//           <select
//             value={newPayment.status}
//             onChange={(e) => setNewPayment({...newPayment, status: e.target.value})}
//           >
//             <option value="pending">Pending</option>
//             <option value="paid">Paid</option>
//           </select>
//           <button type="submit" className="submit-btn">
//             Add Payment
//           </button>
//         </form>
//       )}

//       {/* Loading */}
//       {loading && <p>Loading payments...</p>}

//       {/* Error */}
//       {error && !loading && (
//         <div className="error">
//           <p>⚠️ {error}</p>
//           <button onClick={fetchPayments}>Retry</button>
//         </div>
//       )}

//       {/* Payments Table */}
//       {!loading && !error && (
//         <>
//           {payments.length === 0 ? (
//             <p>No payments found</p>
//           ) : (
//             <>
//               <table className="payments-table">
//                 <thead>
//                   <tr>
//                     <th>Payment ID</th>
//                     <th>Tenant</th>
//                     <th>Date</th>
//                     <th>Amount</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {payments.map((payment) => (
//                     <tr key={payment.paymentId || payment.id}>
//                       <td className="payment-id">{payment.paymentId || "N/A"}</td>
//                       <td>{payment.tenantName}</td>
//                       <td>
//                         {payment.paymentDate 
//                           ? new Date(payment.paymentDate).toLocaleDateString()
//                           : "-"}
//                       </td>
//                       <td>₹{payment.amount?.toLocaleString()}</td>
//                       <td>
//                         <span className={`status ${payment.status}`}>
//                           {payment.status}
//                         </span>
//                       </td>
//                       <td>
//                         <button
//                           className="status-btn"
//                           onClick={() => togglePaymentStatus(payment.paymentId, payment.status)}
//                         >
//                           Mark {payment.status === "paid" ? "Pending" : "Paid"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
              
//               <div className="total">
//                 Total: ₹{totalAmount.toLocaleString()}
//               </div>
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PaymentsList;

// src/pages/PaymentsList.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import "./PaymentsList.css";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    tenantName: "",
    amount: "",
    paymentDate: new Date().toISOString().split('T')[0],
    status: "pending",
    pgId: "",
    pgName: "",
    sharingType: "Single Sharing",
    notes: ""
  });

  // Get token
  const getToken = () => {
    return localStorage.getItem("hlopgToken");
  };

  // Fetch payments and summary
  const fetchPaymentsData = async () => {
    const token = getToken();
    
    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch payments
      const paymentsRes = await api.get("/payments/owner", {
        headers: { 
          Authorization: token
        },
      });

      if (paymentsRes.data.success) {
        setPayments(paymentsRes.data.data || []);
        
        // Try to fetch summary
        try {
          const summaryRes = await api.get("/payments/summary", {
            headers: { 
              Authorization: token
            },
          });
          
          if (summaryRes.data.success) {
            setSummary(summaryRes.data.data);
          }
        } catch (summaryErr) {
          console.warn("Could not fetch summary:", summaryErr.message);
          // Calculate summary manually
          calculateSummary(paymentsRes.data.data || []);
        }
      } else {
        setError(paymentsRes.data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary manually
  const calculateSummary = (paymentsList) => {
    const totalAmount = paymentsList.reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingAmount = paymentsList
      .filter(p => p.status === "pending")
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const paidAmount = paymentsList
      .filter(p => p.status === "paid")
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    setSummary({
      totalAmount,
      pendingAmount,
      paidAmount,
      totalPayments: paymentsList.length,
      pendingCount: paymentsList.filter(p => p.status === "pending").length,
      paidCount: paymentsList.filter(p => p.status === "paid").length
    });
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  // Update payment status
  const togglePaymentStatus = async (paymentId, currentStatus) => {
    const token = getToken();
    
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const newStatus = currentStatus === "paid" ? "pending" : "paid";
      
      const response = await api.put(
        `/payments/${paymentId}/status`,
        { status: newStatus },
        {
          headers: { 
            Authorization: token
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setPayments(prev =>
          prev.map(payment =>
            payment.paymentId === paymentId
              ? { ...payment, status: newStatus }
              : payment
          )
        );
        
        // Recalculate summary
        const updatedPayments = payments.map(p => 
          p.paymentId === paymentId ? { ...p, status: newStatus } : p
        );
        calculateSummary(updatedPayments);
        
        alert(`Payment marked as ${newStatus}!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // Add new payment
  const handleAddPayment = async (e) => {
    e.preventDefault();
    
    const token = getToken();
    
    if (!token) {
      alert("Please login first");
      return;
    }

    if (!newPayment.tenantName.trim() || !newPayment.amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const paymentData = {
        tenantName: newPayment.tenantName,
        amount: parseFloat(newPayment.amount),
        paymentDate: newPayment.paymentDate,
        status: newPayment.status,
        pgId: newPayment.pgId || null,
        pgName: newPayment.pgName || "",
        sharingType: newPayment.sharingType,
        notes: newPayment.notes
      };
      
      const response = await api.post(
        "/payments/create",
        paymentData,
        {
          headers: { 
            Authorization: token
          },
        }
      );

      if (response.data.success) {
        // Add to list
        const newPaymentWithId = response.data.data;
        setPayments(prev => [newPaymentWithId, ...prev]);
        
        // Update summary
        if (summary) {
          const amount = parseFloat(newPayment.amount);
          setSummary(prev => ({
            ...prev,
            totalAmount: prev.totalAmount + amount,
            pendingAmount: newPayment.status === "pending" ? 
              prev.pendingAmount + amount : prev.pendingAmount,
            paidAmount: newPayment.status === "paid" ? 
              prev.paidAmount + amount : prev.paidAmount,
            totalPayments: prev.totalPayments + 1,
            pendingCount: newPayment.status === "pending" ? 
              prev.pendingCount + 1 : prev.pendingCount,
            paidCount: newPayment.status === "paid" ? 
              prev.paidCount + 1 : prev.paidCount
          }));
        }
        
        // Reset form
        setNewPayment({
          tenantName: "",
          amount: "",
          paymentDate: new Date().toISOString().split('T')[0],
          status: "pending",
          pgId: "",
          pgName: "",
          sharingType: "Single Sharing",
          notes: ""
        });
        setShowAddForm(false);
        
        alert("Payment added successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add payment");
    }
  };

  // Calculate totals
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = payments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const paidAmount = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h2>💳 Payments Management</h2>
        <button 
          className="add-payment-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "+ Add Payment"}
        </button>
      </div>

      {/* Add Payment Form */}
      {showAddForm && (
        <form className="add-payment-form" onSubmit={handleAddPayment}>
          <h3>Add New Payment</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Tenant Name *</label>
              <input
                type="text"
                placeholder="Enter tenant name"
                value={newPayment.tenantName}
                onChange={(e) => setNewPayment({...newPayment, tenantName: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                required
                min="0"
                step="100"
              />
            </div>
            
            <div className="form-group">
              <label>Payment Date</label>
              <input
                type="date"
                value={newPayment.paymentDate}
                onChange={(e) => setNewPayment({...newPayment, paymentDate: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select
                value={newPayment.status}
                onChange={(e) => setNewPayment({...newPayment, status: e.target.value})}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>PG Name (Optional)</label>
              <input
                type="text"
                placeholder="PG Name"
                value={newPayment.pgName}
                onChange={(e) => setNewPayment({...newPayment, pgName: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Sharing Type</label>
              <select
                value={newPayment.sharingType}
                onChange={(e) => setNewPayment({...newPayment, sharingType: e.target.value})}
              >
                <option value="Single Sharing">Single Sharing</option>
                <option value="Double Sharing">Double Sharing</option>
                <option value="Triple Sharing">Triple Sharing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>Notes (Optional)</label>
              <textarea
                placeholder="Add any notes"
                value={newPayment.notes}
                onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                rows="2"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Add Payment
            </button>
            <button 
              type="button"
              className="cancel-btn"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading payments data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-state">
          <p>⚠️ {error}</p>
          <button 
            onClick={fetchPaymentsData}
            className="retry-btn"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && !error && payments.length > 0 && (
        <div className="summary-cards">
          <div className="summary-card total">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Total Amount</h3>
              <p>{formatCurrency(totalAmount)}</p>
              <small>{payments.length} payments</small>
            </div>
          </div>
          
          <div className="summary-card pending">
            <div className="card-icon">⏳</div>
            <div className="card-content">
              <h3>Pending</h3>
              <p>{formatCurrency(pendingAmount)}</p>
              <small>{payments.filter(p => p.status === "pending").length} payments</small>
            </div>
          </div>
          
          <div className="summary-card paid">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <h3>Paid</h3>
              <p>{formatCurrency(paidAmount)}</p>
              <small>{payments.filter(p => p.status === "paid").length} payments</small>
            </div>
          </div>
        </div>
      )}

      {/* No Payments */}
      {!loading && !error && payments.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No payments found</h3>
          <p>Add your first payment to get started</p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-first-btn"
          >
            + Add First Payment
          </button>
        </div>
      )}

      {/* Payments Table */}
      {!loading && !error && payments.length > 0 && (
        <>
          <div className="table-header">
            <h3>All Payments ({payments.length})</h3>
            <div className="table-actions">
              <button 
                onClick={fetchPaymentsData}
                className="refresh-btn"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Tenant Name</th>
                  <th>PG Name</th>
                  <th>Date</th>
                  <th>Sharing</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.paymentId || payment.id}>
                    <td className="payment-id">
                      {payment.paymentId || "N/A"}
                    </td>
                    <td className="tenant-name">
                      <strong>{payment.tenantName}</strong>
                      {payment.notes && (
                        <div className="payment-notes">
                          <small>📝 {payment.notes}</small>
                        </div>
                      )}
                    </td>
                    <td>{payment.pgName || "-"}</td>
                    <td>{formatDate(payment.paymentDate)}</td>
                    <td>{payment.sharingType || "-"}</td>
                    <td className="amount">
                      <strong>{formatCurrency(payment.amount)}</strong>
                    </td>
                    <td>
                      <span className={`status-badge ${payment.status}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`status-toggle-btn ${
                          payment.status === "paid" ? "paid" : "pending"
                        }`}
                        onClick={() => togglePaymentStatus(payment.paymentId, payment.status)}
                      >
                        {payment.status === "paid" ? "Mark Pending" : "Mark Paid"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          <div className="payments-footer">
            <div className="footer-summary">
              <div className="summary-item">
                <span>Total:</span>
                <strong>{formatCurrency(totalAmount)}</strong>
              </div>
              <div className="summary-item">
                <span>Pending:</span>
                <strong className="pending">{formatCurrency(pendingAmount)}</strong>
              </div>
              <div className="summary-item">
                <span>Paid:</span>
                <strong className="paid">{formatCurrency(paidAmount)}</strong>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentsList;