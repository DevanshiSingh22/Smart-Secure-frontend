import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./residentDashboard.css";

const ResidentDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [preApprovedVisitors, setPreApprovedVisitors] = useState({ active: [], expired: [] });
  const [form, setForm] = useState({ name: "", contact: "", purpose: "", timeWindow: 6 });
  const [search, setSearch] = useState({ name: "", date: "", purpose: "" });
  const [hoverRating, setHoverRating] = useState({}); // for hover effect
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const visitorRef = useRef(null);
  const searchRef = useRef(null);
  const preApproveRef = useRef(null);

  useEffect(() => {
    if (!token || !user || user.role !== "resident") {
      alert("Session expired or unauthorized! Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }

    fetchVisitors();
    fetchPreApprovedVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/visitors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitors(res.data);
    } catch (err) {
      console.error("Error fetching visitors:", err.response?.data || err.message);
    }
  };

  const fetchPreApprovedVisitors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/visitors/pre-approved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPreApprovedVisitors(res.data);
    } catch (err) {
      console.error("Error fetching pre-approved visitors:", err.response?.data || err.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/visitors/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVisitors();
    } catch (err) {
      console.error("Approve Error:", err.response?.data || err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/visitors/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVisitors();
    } catch (err) {
      console.error("Reject Error:", err.response?.data || err.message);
    }
  };

  const handlePreApprove = async (e) => {
    e.preventDefault();
    try {
      const { name, contact, purpose, timeWindow } = form;
      await axios.post(
        "http://localhost:5000/api/visitors/pre-approve",
        { name, contact, purpose, timeWindow },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPreApprovedVisitors();
      setForm({ name: "", contact: "", purpose: "", timeWindow: 6 });
    } catch (err) {
      console.error("Pre-Approve Error:", err.response?.data || err.message);
    }
  };

  const pendingVisitors = visitors.filter((v) => v.status === "pending");

  const filteredVisitors = visitors.filter((v) => {
    const matchesName = v.name.toLowerCase().includes(search.name.toLowerCase());
    const matchesPurpose = v.purpose.toLowerCase().includes(search.purpose.toLowerCase());
    const matchesDate = search.date
      ? new Date(v.createdAt).toLocaleDateString() === new Date(search.date).toLocaleDateString()
      : true;
    return matchesName && matchesPurpose && matchesDate;
  });

  const handleRatingClick = async (visitorId, star) => {
    try {
      await axios.put(
        `http://localhost:5000/api/visitors/${visitorId}/rate`,
        { rating: star },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedVisitors = visitors.map((v) =>
        v._id === visitorId ? { ...v, rating: star } : v
      );
      setVisitors(updatedVisitors);
    } catch (err) {
      console.error("Rating Error:", err.response?.data || err.message);
    }
  };

  const scrollToRef = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="resident-dashboard">
      {/* Hero section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Welcome to Your Resident Dashboard!</h1>
          <p>Here, you can manage visitors, approve guests, and track pre-approved residents easily!</p>
          <div className="hero-buttons">
            <button onClick={() => scrollToRef(visitorRef)}>See Your Visitors</button>
            <button onClick={() => scrollToRef(searchRef)}>Search Visitor</button>
            <button onClick={() => scrollToRef(preApproveRef)}>Pre-Approve Visitors</button>
            <button onClick={() => scrollToRef(preApproveRef)}>See Pre-Approved Visitors</button>
          </div>
        </div>
      </section>

      {/* Visitor Section */}
      <div ref={visitorRef} className="section-container">
        {pendingVisitors.length > 0 && (
          <div className="pending-alert">
            You have {pendingVisitors.length} new visitor request(s)!
          </div>
        )}

        <h2 ref={searchRef}>Search Visitor History</h2>
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="Visitor Name"
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
          />
          <input
            type="date"
            value={search.date}
            onChange={(e) => setSearch({ ...search, date: e.target.value })}
          />
          <input
            placeholder="Purpose"
            value={search.purpose}
            onChange={(e) => setSearch({ ...search, purpose: e.target.value })}
          />
          <button type="button" onClick={() => setSearch({ name: "", date: "", purpose: "" })}>
            Clear
          </button>
        </form>

        <h2>Visitor Requests</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Date & Time</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.map((v) => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.contact}</td>
                <td>{v.purpose}</td>
                <td>
                  <span className={`status-badge status-${v.status.toLowerCase().replace(" ", "-")}`}>
                    {v.status}
                  </span>
                </td>
                <td>
                  {v.status === "pending" ? (
                    <>
                      <button onClick={() => handleApprove(v._id)}>Approve</button>
                      <button onClick={() => handleReject(v._id)}>Reject</button>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </td>
                <td>{new Date(v.createdAt).toLocaleString()}</td>
                <td>
                  {v.status === "checked-out" && (
                    <div style={{ display: "flex", cursor: "pointer" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            fontSize: "1.2rem",
                            color: (hoverRating[v._id] || v.rating || 0) >= star ? "#FFD700" : "#ccc",
                            marginRight: "2px",
                          }}
                          onMouseEnter={() => setHoverRating({ ...hoverRating, [v._id]: star })}
                          onMouseLeave={() => setHoverRating({ ...hoverRating, [v._id]: 0 })}
                          onClick={() => handleRatingClick(v._id, star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                  {v.rating && <div>Rating: {v.rating}/5</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pre-Approve Form */}
        <h2 ref={preApproveRef}>Pre-Approve Visitor</h2>
        <form className="pre-approve-form" onSubmit={handlePreApprove}>
          <input
            placeholder="Visitor Name"
            value={form.name}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Contact"
            value={form.contact}
            required
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
          <input
            placeholder="Purpose"
            value={form.purpose}
            required
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          />
          <input
            type="number"
            placeholder="Time Window (hours)"
            value={form.timeWindow}
            min="1"
            onChange={(e) => setForm({ ...form, timeWindow: e.target.value })}
          />
          <button type="submit">Pre-Approve</button>
        </form>

        <h2>Pre-Approved Visitors</h2>

        <h3>Active</h3>
        <table className="pre-approved-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Valid Till</th>
            </tr>
          </thead>
          <tbody>
            {preApprovedVisitors.active.map((v) => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.contact}</td>
                <td>{new Date(v.validTill).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Expired</h3>
        <table className="pre-approved-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Expired At</th>
            </tr>
          </thead>
          <tbody>
            {preApprovedVisitors.expired.map((v) => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.contact}</td>
                <td>{new Date(v.validTill).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default ResidentDashboard;
