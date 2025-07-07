import { useEffect, useState } from "react";
import { supabase } from "../../../../packages/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [userData, setUserData] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error.message);
    } else {
      setUserData(data);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div style={{ padding: "1rem", position: "relative", minHeight: "100vh" }}>
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          padding: "0.5rem 1rem",
          border: "none",
          background: "#f44336",
          color: "white",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <h2>Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
        <p>
          You are logged in as <strong>{userData.email}</strong>
        </p>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
}
