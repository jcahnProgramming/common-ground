// src/components/FeedList.tsx
import React from "react";

interface Post {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
}

const FeedList: React.FC<{ posts: Post[] }> = ({ posts }) => {
  if (!posts.length) return <p>No posts yet.</p>;

  return (
    <ul className="feed-list">
      {posts.map((post) => (
        <li key={post.id} className="post-item">
          <p>{post.content}</p>
          <small>{new Date(post.created_at).toLocaleString()}</small>
        </li>
      ))}
    </ul>
  );
};

export default FeedList;
