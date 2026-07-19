import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    try {
      await signup(email, username, password)
      navigate("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1 className="auth-title">Create your account</h1>
        <input
          className="input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="button" type="submit">
          Sign Up
        </button>
        {error && <div className="error-text">{error}</div>}
        <Link className="link" to="/login">
          Already have an account? Login
        </Link>
      </form>
    </div>
  )
}
