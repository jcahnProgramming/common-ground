// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CompleteProfile from "./pages/CompleteProfile";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";
import { useAuth } from "./components/AuthProvider";
import Navbar from "./components/Navbar";

export default function App() {
  const { session } = useAuth();
  console.log("📦 App.tsx rendering. Session:", session);

  return (
    <>
      <Navbar />
      <Routes>
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
        <Route path="/settings" element={<Settings />} />
        <Route path="/user/:id" element={<UserProfile />} />

        {/* 🧪 Placeholder pages for nav links */}
        <Route path="/feed" element={<div style={{ padding: 24 }}>📄 My Feed</div>} />
        <Route path="/friends-feed" element={<div style={{ padding: 24 }}>📄 Friends Feed</div>} />
        <Route path="/messages" element={<div style={{ padding: 24 }}>💬 In-App Messaging</div>} />
        <Route path="/friends" element={<div style={{ padding: 24 }}>👥 Friends List</div>} />
        <Route path="/me" element={<div style={{ padding: 24 }}>🙋‍♂️ My Public Profile</div>} />
      </Routes>
    </>
  );
}
