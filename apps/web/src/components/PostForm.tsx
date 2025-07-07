// src/components/PostForm.tsx
import React, { useState } from "react";
import { supabase } from "@/../packages/supabase/client";
import { useAuth } from "../components/AuthProvider";

const PostForm: React.FC<{ onPostCreated?: () => void }> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return alert("Post content cannot be empty.");

    setLoading(true);

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    const { error } = await supabase.from("posts").insert([
      {
        content,
        tags,
        is_public: isPublic,
        author_id: user?.id,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to create post.");
    } else {
      setContent("");
      setTagsInput("");
      setIsPublic(true);
      if (onPostCreated) onPostCreated();
    }

    setLoading(false);
  };

  return (
    <div className="post-form">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="text"
        placeholder="Tags (comma separated, e.g. hiking, cooking)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />

      <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        Public post
      </label>

      <button onClick={handlePost} disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
};

export default PostForm;
