import React from "react";
import "./Policy.css";

function RefundPolicy() {
  return (
    <div className="policy-container">
      <h1>Refund & Cancellation Policy</h1>

      <h2>Cancellation</h2>
      <ul>
        <li>Cancellations allowed within 2 days of booking.</li>
        <li>If order is already processed or shipped, cancellation may not be allowed.</li>
        <li>Perishable items are not eligible for cancellation.</li>
      </ul>

      <h2>Refund</h2>
      <ul>
        <li>Damaged/defective items must be reported within 2 days.</li>
        <li>If approved, refund will be processed within 2 working days.</li>
        <li>Refunds will be credited to original payment method.</li>
      </ul>

      <p>For support contact: example@hlopg.com</p>
    </div>
  );
}

export default RefundPolicy;
