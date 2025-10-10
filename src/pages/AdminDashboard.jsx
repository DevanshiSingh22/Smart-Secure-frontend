import React from "react";
import LogoutButton from "../../components/LogoutButton";
import "./adminDashboard.css";

const AdminDashboard = ({ setUser }) => {
  return (
    <div className="admin-dashboard">
      {/* Hero Section with frosted glass overlay */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Oopss… We’re Still Expanding!</h1>
          <p>
            The admin panel is under development. Soon, you'll be able to manage users, security settings, 
            and monitor overall activity seamlessly.
          </p>
          <LogoutButton setUser={setUser} />
        </div>
      </section>

      {/* Image placeholder */}
      <div className="hero-image-placeholder">
        {/* Replace the background image in CSS or insert an <img> here */}
      </div>

      <section className="section-container">
        <h2>Coming Soon</h2>
        <p>We're working hard to bring full admin features. Stay tuned!</p>
      </section>
    </div>
  );
};

export default AdminDashboard;
