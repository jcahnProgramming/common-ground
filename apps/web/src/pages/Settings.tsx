import React, { useEffect, useState } from "react";
import { supabase } from "../../../../packages/supabase/client";
import { useAuth } from "../components/AuthProvider";
import "./Settings.css";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("bio, interests")
        .eq("id", user?.id)
        .single();

      if (!error && data) {
        setBio(data.bio ?? "");
        setInterests(data.interests ?? []);
      }
    };

    fetchProfile();
  }, [user]);

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

  const handleProfileSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({ bio, interests })
      .eq("id", user?.id);

    if (error) {
      alert("Failed to save profile info.");
      console.error(error);
    } else {
      alert("Profile updated.");
    }
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert("Failed to change password.");
      console.error(error);
    } else {
      alert("Password changed.");
      setNewPassword("");
    }
  };

  return (
    <div className="settings">
      <h2>Settings</h2>

      <label>Bio</label>
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

      <label>Interests</label>
      <input
        type="text"
        value={interestInput}
        onChange={handleInterestChange}
        placeholder="e.g. Music, Hiking, Games"
      />
      <div className="interest-tags">
        {interests.map((interest, index) => (
          <span key={index} className="tag">
            {interest}
            <button className="remove" onClick={() => removeInterest(index)}>
              ×
            </button>
          </span>
        ))}
      </div>

      <button onClick={handleProfileSave} disabled={saving}>
        {saving ? "Saving..." : "Save Profile Info"}
      </button>

      <hr />

      <label>New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="••••••••"
      />
      <button onClick={handlePasswordChange} disabled={!newPassword}>
        Change Password
      </button>

      <hr />

      <label>Privacy Settings (coming soon)</label>
      <input type="checkbox" disabled /> Hide my profile from search

      <label>Notification Preferences (coming soon)</label>
      <input type="checkbox" disabled /> Email me about new features
    </div>
  );
};

export default Settings;
