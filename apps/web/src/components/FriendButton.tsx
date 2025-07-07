import React, { useEffect, useState } from "react";
import { supabase } from "../../../../packages/supabase/client";
import { useAuth } from "./AuthProvider";

type FriendStatus = "none" | "pending_sent" | "pending_received" | "accepted";

interface FriendButtonProps {
  profileId: string;
}

const FriendButton: React.FC<FriendButtonProps> = ({ profileId }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<FriendStatus>("none");
  const [friendRowId, setFriendRowId] = useState<string | null>(null);

  const isSelf = profileId === user?.id;

  useEffect(() => {
    const checkStatus = async () => {
      if (!user?.id || !profileId) return;

      const { data } = await supabase
        .from("friends")
        .select("id, requester_id, recipient_id, status")
        .or(`and(requester_id.eq.${user.id},recipient_id.eq.${profileId}),and(requester_id.eq.${profileId},recipient_id.eq.${user.id})`)
        .maybeSingle();

      if (!data) {
        setStatus("none");
        return;
      }

      setFriendRowId(data.id);

      if (data.status === "accepted") {
        setStatus("accepted");
      } else if (data.status === "pending") {
        setStatus(data.requester_id === user.id ? "pending_sent" : "pending_received");
      }
    };

    checkStatus();
  }, [user, profileId]);

  const addFriend = async () => {
    const { error } = await supabase.from("friends").insert({
      requester_id: user?.id,
      recipient_id: profileId,
      status: "pending",
    });

    if (!error) setStatus("pending_sent");
  };

  const acceptFriend = async () => {
    if (!friendRowId) return;
    await supabase.from("friends").update({ status: "accepted" }).eq("id", friendRowId);
    setStatus("accepted");
  };

  const declineFriend = async () => {
    if (!friendRowId) return;
    await supabase.from("friends").update({ status: "declined" }).eq("id", friendRowId);
    setStatus("none");
  };

  const unfriend = async () => {
    if (!friendRowId) return;
    await supabase.from("friends").delete().eq("id", friendRowId);
    setStatus("none");
  };

  if (isSelf) return null;

  switch (status) {
    case "none":
      return <button onClick={addFriend}>➕ Add Friend</button>;
    case "pending_sent":
      return <button disabled>🕓 Request Sent</button>;
    case "pending_received":
      return (
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={acceptFriend}>✅ Accept</button>
          <button onClick={declineFriend}>❌ Decline</button>
        </div>
      );
    case "accepted":
      return <button onClick={unfriend}>❌ Unfriend</button>;
    default:
      return null;
  }
};

export default FriendButton;
