import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { api } from "../api"

const TYPES = [
  { key: "start", label: "Opening" },
  { key: "middle", label: "Middle Game" },
  { key: "end", label: "End Game" },
]

export default function BookMovesPage() {
  const [type, setType] = useState("start")
  const [moves, setMoves] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const load = async (nextType) => {
    setType(nextType)
    setLoading(true)
    setError("")
    try {
      const data = await api.bookMoves(nextType)
      setMoves(data.moves)
    } catch (err) {
      setError(err.message)
      setMoves([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load("start")
  }, [])

  return (
    <div className="page">
      <NavBar title="Master Book Moves" />
      <div className="page-body">
        <div className="tab-row">
          {TYPES.map((item) => (
            <button
              key={item.key}
              className={"tab" + (type === item.key ? " tab-active" : "")}
              onClick={() => load(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-text">{error}</div>}
        {!loading && !error && (
          <table className="moves-table">
            <thead>
              <tr>
                <th>Move</th>
                <th>White</th>
                <th>Draw</th>
                <th>Black</th>
                <th>Games</th>
              </tr>
            </thead>
            <tbody>
              {moves.map((move) => (
                <tr key={move.san}>
                  <td>{move.san}</td>
                  <td>{move.white}</td>
                  <td>{move.draws}</td>
                  <td>{move.black}</td>
                  <td>{move.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
