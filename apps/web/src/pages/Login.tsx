import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../packages/supabase/client";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      setErrorMsg("Invalid credentials. Please try again.");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 300, margin: "0 auto" }}>
        <input
          type="email"
          placeholder="Email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
