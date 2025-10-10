import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../api/axios";
import bgVideo from "../assets/background-video.mp4"; 

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ password toggle state

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (setUser) setUser(res.data.user);

      const role = res.data.user.role;
      if (role === "resident") navigate("/resident-dashboard");
      else if (role === "guard") navigate("/guard-dashboard");
      else if (role === "admin") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setMessage(error.response?.data?.message || "Login failed!");
    }
  };

  // Scroll smoothly to login section
  const scrollToLogin = () => {
    document.getElementById("login-section").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="login-page">
      {/* 🎥 Background Video */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* 🌟 Hero Section */}
      <div className="hero-content">
        <h1>Welcome to SmartSecure</h1>
        <p className="subtitle">Your smart security assistant for safer communities</p>
        <button onClick={scrollToLogin}>Get Started</button>
      </div>

      {/* 🔐 Login Form Section */}
      <div id="login-section" className="login-section">
        <div className="form-box">
          <h2>Login</h2>
          {message && <p className="error">{message}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="password-wrapper" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"} // ✅ toggle type
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <button type="submit">Login</button>
          </form>
          <p className="register-text">
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
