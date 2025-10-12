import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './guardDashboard.css';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const GuardDashboard = () => {
  const [residents, setResidents] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const token = localStorage.getItem("token");

  const addVisitorRef = useRef(null);
  const visitorsTableRef = useRef(null);

  // Fetch all residents
  const fetchResidents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResidents(res.data);
    } catch (err) {
      console.error("Error fetching residents:", err.response?.data || err.message);
    }
  };

  // Fetch all visitors
  const fetchVisitors = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/visitors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitors(res.data);
    } catch (err) {
      console.error("Error fetching visitors:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchResidents();
    fetchVisitors();
    
  }, []);

  // Check-In visitor
  const handleCheckIn = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/api/visitors/${id}/checkin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVisitors();
    } catch (err) {
      console.error("Check-in Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error checking in visitor");
    }
  };

  // Check-Out visitor
  const handleCheckOut = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/api/visitors/${id}/checkout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVisitors();
    } catch (err) {
      console.error("Check-out Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error checking out visitor");
    }
  };

  // Scroll helpers
  const scrollToAddVisitor = () => {
    addVisitorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToVisitorsTable = () => {
    visitorsTableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="guard-dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <h1>Guard Dashboard</h1>
          <div className="hero-buttons">
            <button onClick={scrollToAddVisitor}>Add Visitor</button>
            <button onClick={scrollToVisitorsTable}>Check-In Visitors</button>
          </div>
        </div>
      </div>

      {/* Add Visitor Form */}
      <div className="section-container" ref={addVisitorRef}>
        <h2>Add Visitor</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const { name, contact, purpose, resident } = e.target.elements;
            try {
              await axios.post(
                 `${BACKEND_URL}/api/visitors/add`,
                {
                  name: name.value,
                  contact: contact.value,
                  purpose: purpose.value,
                  resident: resident.value,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              fetchVisitors();
              e.target.reset();
            } catch (err) {
              console.error("Add Visitor Error:", err.response?.data || err.message);
              alert(err.response?.data?.message || "Error adding visitor");
            }
          }}
        >
          <input name="name" placeholder="Visitor Name" required />
          <input name="contact" placeholder="Contact" required />
          <input name="purpose" placeholder="Purpose" required />
          <select name="resident" required>
            <option value="">Select Resident</option>
            {residents.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
          <button type="submit">Add Visitor</button>
        </form>
      </div>

      {/* Visitors List */}
      <div className="section-container" ref={visitorsTableRef}>
        <h2>Visitors List</h2>
        <table>
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Contact</th>
              <th>Purpose</th>
              <th>Resident</th>
              <th>Status</th>
              <th>Created On</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => {
              const now = new Date();
              const isPreApprovedValid =
                v.status === "pre-approved" &&
                v.validTill &&
                new Date(v.validTill) >= now;

              return (
                <tr key={v._id}>
                  <td>{v.name}</td>
                  <td>{v.contact}</td>
                  <td>{v.purpose}</td>
                  <td>{v.resident?.name || "Unknown"}</td>
                  <td>
                    <span className={`status-badge status-${v.status.toLowerCase().replace(" ", "-")}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>{new Date(v.createdAt).toLocaleString()}</td>
                  <td>
                    {!v.checkInTime && (v.status === "approved" || isPreApprovedValid) && (
                      <button onClick={() => handleCheckIn(v._id)}>Check-In</button>
                    )}
                    {v.checkInTime && <span>{new Date(v.checkInTime).toLocaleString()}</span>}
                  </td>
                  <td>
                    {!v.checkOutTime && v.checkInTime && (
                      <button onClick={() => handleCheckOut(v._id)}>Check-Out</button>
                    )}
                    {v.checkOutTime && <span>{new Date(v.checkOutTime).toLocaleString()}</span>}
                  </td>
                  <td>
                    {v.rating ? (
                      <div style={{ display: "flex" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              fontSize: "1.2rem",
                              color: v.rating >= star ? "#FFD700" : "#ccc",
                              marginRight: "2px",
                            }}
                          >
                            ★
                          </span>
                        ))}
                        <span style={{ marginLeft: "5px" }}>{v.rating}/5</span>
                      </div>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuardDashboard;
