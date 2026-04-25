import React from "react";
import "./Policy.css";

function ReturnPolicy() {
  return (
    <div className="policy-container">
      <h1>Return Policy</h1>

      <p>
        We offer return or exchange within 2 days from the date of purchase.
      </p>

      <ul>
        <li>Item must be unused and in original packaging.</li>
        <li>Sale items may not be eligible for return.</li>
        <li>Only defective/damaged items will be replaced.</li>
      </ul>

      <p>
        Once we receive and inspect the item, we will notify you
        regarding approval or rejection of your request.
      </p>
    </div>
  );
}

export default ReturnPolicy;
