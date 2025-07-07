// src/pages/MyFeed.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@supabase/client";
import { useAuth } from "../components/AuthProvider";
import FeedList from "../components/FeedList";
import PostForm from "../components/PostForm";

const MyFeed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    if (!user) return;

    // Step 1: Get bucket IDs the user belongs to
    const { data: buckets, error: bucketErr } = await supabase
      .from("bucket_members")
      .select("bucket_id")
      .eq("user_id", user.id);

    if (bucketErr) {
      console.error("Bucket fetch error:", bucketErr);
      setLoading(false);
      return;
    }

    const bucketIds = buckets?.map((b) => b.bucket_id) ?? [];

    // Step 2: Get user IDs of others in the same buckets
    const { data: sharedMembers, error: memberErr } = await supabase
      .from("bucket_members")
      .select("user_id")
      .in("bucket_id", bucketIds);

    if (memberErr) {
      console.error("Shared member fetch error:", memberErr);
      setLoading(false);
      return;
    }

    const sharedUserIds = [...new Set(sharedMembers?.map((m) => m.user_id) ?? [])];

    // Step 3: Fetch posts by users in shared buckets
    const { data: feedPosts, error: postErr } = await supabase
      .from("posts")
      .select("*")
      .in("author_id", sharedUserIds.length ? sharedUserIds : ["00000000-0000-0000-0000-000000000000"]) // avoid error on empty array
      .order("created_at", { ascending: false });

    if (postErr) {
      console.error("Post fetch error:", postErr);
    }

    setPosts(feedPosts || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [user]);

  return (
    <div className="feed-page">
      <h2>My Feed</h2>
      <PostForm onPostCreated={fetchFeed} />
      {loading ? <p>Loading...</p> : <FeedList posts={posts} />}
    </div>
  );
};

export default MyFeed;
