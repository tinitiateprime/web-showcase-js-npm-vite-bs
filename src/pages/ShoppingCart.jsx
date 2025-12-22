import React from "react";

const ShoppingCart = () => (
  <div className="container mt-4">
    <h1>🛒 Shopping Cart</h1>
    <p>Your selected items will appear here.</p>
    <ul className="list-group mt-3">
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Item 1 <span className="badge bg-primary">1</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Item 2 <span className="badge bg-primary">2</span>
      </li>
    </ul>
  </div>
);

export default ShoppingCart;
