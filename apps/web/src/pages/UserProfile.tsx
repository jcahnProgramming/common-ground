// src/pages/UserProfile.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../../../packages/supabase/client";
import { useAuth } from "../components/AuthProvider";
import FriendButton from "../components/FriendButton";
import "./UserProfile.css";

interface UserData {
  id: string;
  email: string;
  username: string | null;
  bio: string | null;
  interests: string[] | null;
  groups: string[];
  images: string[];
  feed: { text: string; isPublic: boolean }[];
}

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const { user: viewer } = useAuth();

  const [profile, setProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false); // Placeholder until real logic

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, username, bio, interests")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProfile({
          ...data,
          groups: ["Group One", "Group Two"],
          images: [
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150/aaa",
          ],
          feed: [
            { text: "Public post 1", isPublic: true },
            { text: "Private post 2", isPublic: false },
          ],
        });
      }

      setLoading(false);
    };

    fetchUser();
  }, [id]);

  if (loading || !profile) return <div className="user-profile">Loading...</div>;

  const isSelf = profile.id === viewer?.id;
  const viewerInterests = viewer?.user_metadata?.interests || [];

  const sharedInterests =
    viewerInterests && profile.interests
      ? profile.interests.filter((tag) => viewerInterests.includes(tag))
      : [];

  return (
    <div className="user-profile">
      <div className="header">
        <img
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${profile.email}`}
          alt="avatar"
          className="avatar"
        />
        <div>
          <h2>{profile.username || profile.email.split("@")[0]}</h2>
          {profile.bio && <p className="bio">{profile.bio}</p>}
        </div>

        {/* ✅ Friend logic handled by smart component */}
        {!isSelf && <FriendButton profileId={profile.id} />}
      </div>

      {profile.interests?.length ? (
        <div className="interests">
          <h3>Interests</h3>
          <div className="tags">
            {profile.interests.map((interest, i) => (
              <span
                key={i}
                className={`tag ${sharedInterests.includes(interest) ? "shared" : ""}`}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="groups">
        <h3>Groups</h3>
        <ul>
          {profile.groups.map((g, i) => (
            <li key={i}>
              <a href={`/groups/${g.toLowerCase().replace(" ", "-")}`}>{g}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="gallery">
        <h3>Image Gallery</h3>
        <div className="grid">
          {profile.images.map((url, i) => (
            <img key={i} src={url} alt={`gallery-${i}`} />
          ))}
        </div>
      </div>

      <div className="feed">
        <h3>User Feed</h3>
        <ul>
          {profile.feed
            .filter((post) => post.isPublic || isFriend || isSelf)
            .map((post, i) => (
              <li key={i}>{post.text}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
