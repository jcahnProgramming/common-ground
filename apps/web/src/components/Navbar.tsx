import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navItems = [
    { label: "My Feed", path: "/feed" },
    { label: "Friends Feed", path: "/friends-feed" },
    { label: "Messages", path: "/messages" },
    { label: "Friends", path: "/friends" },
    { label: "My Profile", path: "/me" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="app-title">Common Ground</span>
        <div className="nav-links">
          {navItems.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
