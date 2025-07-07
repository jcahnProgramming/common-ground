// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CompleteProfile from "./pages/CompleteProfile";
import Settings from "./pages/Settings";
import { useAuth } from "./components/AuthProvider";

export default function App() {
  const { session } = useAuth();
  console.log("📦 App.tsx rendering. Session:", session);

  return (
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
    </Routes>
  );
}
