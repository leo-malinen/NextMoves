import { useNavigate } from "react-router-dom"

export default function NavBar({ title }) {
  const navigate = useNavigate()
  return (
    <header className="app-bar">
      <button className="icon-button" onClick={() => navigate(-1)}>
        &#8592;
      </button>
      <span className="app-bar-title">{title}</span>
      <button className="icon-button" onClick={() => navigate("/")}>
        &#8962;
      </button>
    </header>
  )
}
