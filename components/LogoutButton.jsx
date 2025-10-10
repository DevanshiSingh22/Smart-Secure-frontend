import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton=({setUser})=>{
    const navigate =useNavigate();
    const handleLogout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if(setUser) setUser(null);
        navigate("/login");
    };
    return <button onClick={handleLogout}>Logout</button>;

};

export default LogoutButton;