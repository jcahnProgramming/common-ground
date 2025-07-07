import React, { useState } from "react";
import { supabase } from "@supabase/client";
import { useAuth } from "../components/AuthProvider";
import "./PostForm.css";

interface PostFormProps {
  onPostCreated: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.includes(",")) {
      const newTags = input
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      setTags((prev) => [...prev, ...newTags]);
      setTagInput("");
    } else {
      setTagInput(input);
    }
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("posts").insert([
      {
        author_id: user?.id, // 🔁 fixed here
        content,
        tags,
        visibility: "public",
      },
    ]);

    if (error) {
      alert("Failed to post.");
      console.error("❌ Supabase error:", error);
    } else {
      setContent("");
      setTags([]);
      setTagInput("");
      onPostCreated();
    }

    setLoading(false);
  };

  return (
    <div className="post-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={4}
      />

      <input
        type="text"
        value={tagInput}
        onChange={handleTagInput}
        placeholder="Add tags (comma-separated)"
      />

      <div className="tag-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button onClick={() => removeTag(index)}>×</button>
          </span>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={loading || !content.trim()}>
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
};

export default PostForm;
