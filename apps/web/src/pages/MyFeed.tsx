import React, { useEffect, useState } from "react";
import { supabase } from "../../../packages/supabase/client";
import { useAuth } from "../components/AuthProvider";
import FeedList from "../components/FeedList";

const MyFeed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!user) return;

      // Get all bucket IDs for the user
      const { data: buckets } = await supabase
        .from("bucket_members")
        .select("bucket_id")
        .eq("user_id", user.id);

      const bucketIds = buckets?.map((b) => b.bucket_id) ?? [];

      // Get all users who share any bucket
      const { data: sharedMembers } = await supabase
        .from("bucket_members")
        .select("user_id")
        .in("bucket_id", bucketIds);

      const sharedUserIds = [...new Set(sharedMembers?.map((m) => m.user_id) ?? [])];

      // Fetch posts from those users
      const { data: feedPosts } = await supabase
        .from("posts")
        .select("*")
        .in("author_id", sharedUserIds)
        .order("created_at", { ascending: false });

      setPosts(feedPosts || []);
      setLoading(false);
    };

    fetchFeed();
  }, [user]);

  return (
    <div className="feed-page">
      <h2>My Feed</h2>
      {loading ? <p>Loading...</p> : <FeedList posts={posts} />}
    </div>
  );
};

export default MyFeed;
