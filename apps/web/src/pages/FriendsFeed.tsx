// src/pages/FriendsFeed.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@supabase/client";
import { useAuth } from "../components/AuthProvider";
import FeedList from "../components/FeedList";
import PostForm from "../components/PostForm";

const FriendsFeed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriendsFeed = async () => {
    if (!user) return;

    // Step 1: Get all confirmed friends (mutual connections)
    const { data: friends, error: friendErr } = await supabase
      .from("friends")
      .select("sender_id, receiver_id")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .eq("status", "accepted");

    if (friendErr) {
      console.error("❌ Failed to fetch friends:", friendErr);
      setLoading(false);
      return;
    }

    const friendIds = new Set<string>();

    friends?.forEach((f) => {
      if (f.sender_id !== user.id) friendIds.add(f.sender_id);
      if (f.receiver_id !== user.id) friendIds.add(f.receiver_id);
    });

    // Step 2: Fetch posts from friends
    const { data: friendPosts, error: postErr } = await supabase
      .from("posts")
      .select("*")
      .in("author_id", Array.from(friendIds).length > 0 ? Array.from(friendIds) : ["00000000-0000-0000-0000-000000000000"])
      .order("created_at", { ascending: false });

    if (postErr) {
      console.error("❌ Failed to fetch friend posts:", postErr);
    }

    setPosts(friendPosts ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFriendsFeed();
  }, [user]);

  return (
    <div className="feed-page">
      <h2>Friends Feed</h2>
      <PostForm onPostCreated={fetchFriendsFeed} />
      {loading ? <p>Loading...</p> : <FeedList posts={posts} />}
    </div>
  );
};

export default FriendsFeed;
