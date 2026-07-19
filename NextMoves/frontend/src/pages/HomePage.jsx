import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className="page">
      <header className="app-bar">
        <span className="app-bar-title">Welcome to NextMoves</span>
        <div className="app-bar-actions">
          <button
            className="icon-button"
            title="Chess Board"
            onClick={() => navigate("/board")}
          >
            {"\u265F"}
          </button>
          <button className="text-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <div className="home-body">
        <div className="home-knight">{"\u265E"}</div>
        <h1 className="home-title">Welcome to NextMoves</h1>
        <div className="home-underline" />
        <p className="home-user">{user ? user.username : "User"}</p>
        <div className="home-buttons">
          <button className="button" onClick={() => navigate("/openings")}>
            Opening Book Moves
          </button>
          <button className="button" onClick={() => navigate("/middlegames")}>
            Middle Games
          </button>
          <button className="button" onClick={() => navigate("/endgames")}>
            End Games
          </button>
          <button className="button" onClick={() => navigate("/upload")}>
            Upload a Board
          </button>
          <button
            className="button secondary-button"
            onClick={() => navigate("/book-moves")}
          >
            Master Book Moves
          </button>
        </div>
        <p className="home-rating">Rating: {user ? user.rating : 800}</p>
      </div>
    </div>
  )
}
