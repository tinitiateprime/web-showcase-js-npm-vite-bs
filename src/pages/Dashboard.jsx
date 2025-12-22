import React from "react";

const Dashboard = () => (
  <div className="container mt-4">
    <h1>📊 Dashboard</h1>
    <p>Overview of your app's data and performance.</p>
    <div className="row mt-4">
      <div className="col-md-4">
        <div className="card text-white bg-success mb-3">
          <div className="card-body">
            <h5 className="card-title">Users</h5>
            <p className="card-text">1,200 active users</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-info mb-3">
          <div className="card-body">
            <h5 className="card-title">Sales</h5>
            <p className="card-text">$3,450 this month</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
