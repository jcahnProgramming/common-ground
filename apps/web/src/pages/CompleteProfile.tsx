// src/pages/CompleteProfile.tsx
import React, { useState } from "react";
import { supabase } from "../../../../packages/supabase/client";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import "./CompleteProfile.css";
import { updateBuckets } from "@/utils/updateBuckets";

const CompleteProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.includes(",")) {
      const split = input.split(",").map((s) => s.trim()).filter(Boolean);
      setInterests((prev) => [...prev, ...split]);
      setInterestInput("");
    } else {
      setInterestInput(input);
    }
  };

  const removeInterest = (index: number) => {
    setInterests((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const { error } = await supabase
      .from("users")
      .update({ username, interests, bio })
      .eq("id", user?.id);

    if (error) {
      console.error("🔥 Supabase update error:", error);
      alert("Failed to update profile.");
    } else {
      await updateBuckets({ user_id: session.user.id, access_token: session.access_token });
      console.log("✅ Profile updated");
      navigate("/dashboard");
    }
  };

  return (
    <div className="complete-profile">
      <h2>Complete Your Profile</h2>

      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter a unique username"
      />

      <label>Interests (type and press comma)</label>
      <input
        type="text"
        value={interestInput}
        onChange={handleInterestChange}
        placeholder="e.g. Hiking, Jazz, Cooking"
      />
      <div className="interest-tags">
        {interests.map((interest, index) => (
          <span key={index} className="tag">
            {interest}
            <button className="remove" onClick={() => removeInterest(index)}>×</button>
          </span>
        ))}
      </div>

      <label>Bio (optional)</label>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us a bit about yourself..."
      />

      <button onClick={handleSubmit} className="save-button">Save Profile</button>
    </div>
  );
};

export default CompleteProfile;
