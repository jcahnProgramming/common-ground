// src/pages/Setup.tsx
import { useEffect, useState } from "react"
import { supabase } from "../../../../packages/supabase/client"
import { useNavigate } from "react-router-dom"

export default function Setup() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("User not found")
      setLoading(false)
      return
    }

    const { data: existing, error: existingError } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .single()

    if (existing) {
      setError("Username already taken")
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ username })
      .eq("id", user.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    navigate("/") // Back to app
  }

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Choose a username</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          required
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  )
}
