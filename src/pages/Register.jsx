import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api/axios";
import './register.css';

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "resident" });
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await API.post("/auth/register", form);
      console.log("Register response:", res.data);
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error.response?.data);
      setMessage(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="register-page">
      {/* Left side image */}
      <div className="image-side"></div>

      {/* Right side form */}
      <div className="form-side">
        <div className="form-box">
          <h2>Register</h2>
          {message && <p className="error">{message}</p>}
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            
            {/* Custom frosted dropdown */}
            <div className="custom-select-wrapper">
              <div className="custom-select">
                <div className="selected" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
                </div>
                {dropdownOpen && (
                  <ul className="options">
                    {["resident", "guard", "admin"].map((roleOption) => (
                      <li
                        key={roleOption}
                        onClick={() => {
                          setForm({ ...form, role: roleOption });
                          setDropdownOpen(false);
                        }}
                      >
                        {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button type="submit">Register</button>
          </form>
          <p className="register-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
