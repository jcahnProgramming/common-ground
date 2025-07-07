// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CompleteProfile from "./pages/CompleteProfile";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";
import FriendsDashboard from "./pages/FriendsDashboard";
import MyFeed from "./pages/MyFeed";              // ✅ added
import FriendsFeed from "./pages/FriendsFeed";    // ✅ added
import { useAuth } from "./components/AuthProvider";
import Navbar from "./components/Navbar";

export default function App() {
  const { session } = useAuth();
  console.log("📦 App.tsx rendering. Session:", session);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public & Auth Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={session ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={session ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* Profile & Social */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/friends" element={<FriendsDashboard />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/feed" element={<MyFeed />} />             {/* ✅ My Feed */}
        <Route path="/friends-feed" element={<FriendsFeed />} /> {/* ✅ Friends Feed */}
        <Route path="/messages" element={<div style={{ padding: 24 }}>💬 In-App Messaging</div>} />
      </Routes>
    </>
  );
}
