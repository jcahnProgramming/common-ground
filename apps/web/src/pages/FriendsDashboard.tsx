import React, { useEffect, useState } from "react";
import { supabase } from "../../../../packages/supabase/client";
import { useAuth } from "../components/AuthProvider";
import { Link } from "react-router-dom";
import "./FriendsDashboard.css";

type FriendRow = {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: string;
  created_at: string;
  requester: { id: string; username: string | null; email: string };
  recipient: { id: string; username: string | null; email: string };
};

const FriendsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState<FriendRow[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRow[]>([]);
  const [friends, setFriends] = useState<FriendRow[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("friends")
        .select("*, requester:requester_id (id, username, email), recipient:recipient_id (id, username, email)")
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);

      if (error) {
        console.error(error);
        return;
      }

      const incomingReqs = data.filter(
        (f) => f.status === "pending" && f.recipient_id === user.id
      );

      const outgoingReqs = data.filter(
        (f) => f.status === "pending" && f.requester_id === user.id
      );

      const currentFriends = data.filter((f) => f.status === "accepted");

      setIncoming(incomingReqs);
      setOutgoing(outgoingReqs);
      setFriends(currentFriends);
    };

    fetchFriends();
  }, [user]);

  const acceptFriend = async (id: string) => {
    await supabase.from("friends").update({ status: "accepted" }).eq("id", id);
    location.reload();
  };

  const declineFriend = async (id: string) => {
    await supabase.from("friends").update({ status: "declined" }).eq("id", id);
    location.reload();
  };

  const unfriend = async (id: string) => {
    await supabase.from("friends").delete().eq("id", id);
    location.reload();
  };

  const renderUserLink = (user: { id: string; username: string | null; email: string }) => (
    <Link to={`/user/${user.id}`}>
      {user.username || user.email.split("@")[0]}
    </Link>
  );

  return (
    <div className="friends-dashboard">
      <h2>Friends Dashboard</h2>

      <section>
        <h3>Incoming Requests</h3>
        {incoming.length === 0 ? (
          <p>No incoming requests.</p>
        ) : (
          <ul>
            {incoming.map((f) => (
              <li key={f.id}>
                {renderUserLink(f.requester)}
                <button onClick={() => acceptFriend(f.id)}>✅ Accept</button>
                <button onClick={() => declineFriend(f.id)}>❌ Decline</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Sent Requests</h3>
        {outgoing.length === 0 ? (
          <p>No outgoing requests.</p>
        ) : (
          <ul>
            {outgoing.map((f) => (
              <li key={f.id}>
                Sent to {renderUserLink(f.recipient)} (pending)
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Current Friends</h3>
        {friends.length === 0 ? (
          <p>You have no friends yet.</p>
        ) : (
          <ul>
            {friends.map((f) => {
              const friendUser =
                f.requester_id === user?.id ? f.recipient : f.requester;
              return (
                <li key={f.id}>
                  {renderUserLink(friendUser)}
                  <button onClick={() => unfriend(f.id)}>❌ Unfriend</button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default FriendsDashboard;
