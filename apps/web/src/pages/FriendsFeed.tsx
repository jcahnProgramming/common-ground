import React, { useEffect, useState } from "react";
import { supabase } from "../../../packages/supabase/client";
import { useAuth } from "../components/AuthProvider";
import FeedList from "../components/FeedList";

const FriendsFeed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendsFeed = async () => {
      if (!user) return;

      const { data: friends } = await supabase
        .from("friends")
        .select("requester_id, recipient_id")
        .eq("status", "accepted")
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);

      const friendIds = friends?.map((f) =>
        f.requester_id === user.id ? f.recipient_id : f.requester_id
      ) ?? [];

      const { data: friendPosts } = await supabase
        .from("posts")
        .select("*")
        .in("author_id", friendIds)
        .order("created_at", { ascending: false });

      setPosts(friendPosts || []);
      setLoading(false);
    };

    fetchFriendsFeed();
  }, [user]);

  return (
    <div className="feed-page">
      <h2>Friends Feed</h2>
      {loading ? <p>Loading...</p> : <FeedList posts={posts} />}
    </div>
  );
};

export default FriendsFeed;
