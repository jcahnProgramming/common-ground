// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { supabase } from "../../../../packages/supabase/client";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [customUsername, setCustomUsername] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const navItems = [
    { label: "My Feed", path: "/feed" },
    { label: "Friends Feed", path: "/friends-feed" },
    { label: "Messages", path: "/messages" },
    { label: "Friends", path: "/friends" },
    // ❌ Removed static My Profile path
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("id", user.id)
        .single();

      if (!error && data?.username) {
        setCustomUsername(data.username);
      }
    };

    fetchUsername();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {/* ✅ Dynamic My Profile link */}
          {user && (
            <NavLink
              to={`/user/${user.id}`}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              My Profile
            </NavLink>
          )}
        </div>

        {user && (
          <div
            className="user-info"
            onClick={() => setShowDropdown(!showDropdown)}
            ref={dropdownRef}
          >
            <img
              className="avatar"
              src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.email}`}
              alt="avatar"
            />
            <span className="username">
              {customUsername || user.email.split("@")[0]}
            </span>

            {showDropdown && (
              <div className="dropdown">
                <NavLink to="/settings" className="dropdown-item">
                  Settings
                </NavLink>
                <button onClick={handleLogout} className="dropdown-item logout">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
