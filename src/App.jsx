import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResidentDashboard from "./pages/ResidentDashboard";
import GuardDashboard from "./pages/GuardDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AiAssistant from "../components/AiAssistant";
import './App.css';



function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  return (
    <Router>
      {/* Define all routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/resident-dashboard"
          element={
            user?.role === "resident" ? (
              <ResidentDashboard setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/guard-dashboard"
          element={
            user?.role === "guard" ? (
              <GuardDashboard setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            user?.role === "admin" ? (
              <AdminDashboard setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <AiAssistant />
    </Router>
  );
}

export default App;
