// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../../../packages/supabase/client";
import { useNavigate } from "react-router-dom";
import ToastBanner from "../components/ToastBanner";
import { useAuth } from "../components/AuthProvider";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("username, interests")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      }

      if (!data || !data.username || !data.interests || data.interests.length === 0) {
        setShowBanner(true);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      {showBanner && (
        <ToastBanner
          message="Complete your profile to unlock more features."
          actionText="Finish Now"
          onClick={() => navigate("/complete-profile")}
        />
      )}
      <h2>Welcome back, {user?.email}</h2>
      <button onClick={() => supabase.auth.signOut()}>Logout</button>
    </div>
  );
};

export default Dashboard;
