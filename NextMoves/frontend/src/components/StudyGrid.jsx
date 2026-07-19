import { useEffect, useState } from "react"
import { api } from "../api"

export default function StudyGrid({ category, onOpen }) {
  const [studies, setStudies] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [error, setError] = useState("")

  const load = () => {
    setLoading(true)
    api
      .listStudies(category)
      .then((data) => setStudies(data.studies))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [category])

  const toggleFavorite = async (study) => {
    const data = await api.updateStudy(study.id, {
      isFavorite: !study.isFavorite,
    })
    setStudies((prev) => {
      const next = prev.map((item) =>
        item.id === study.id ? data.study : item
      )
      next.sort((a, b) =>
        a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1
      )
      return next
    })
  }

  const saveNew = async () => {
    const title = newTitle.trim()
    if (!title) {
      setError("Please enter a name")
      return
    }
    const data = await api.createStudy({ category, title })
    setStudies((prev) => [...prev, data.study])
    setNewTitle("")
    setAdding(false)
    setError("")
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div>
      {error && <div className="error-text">{error}</div>}
      <div className="grid">
        {studies.map((study) => (
          <div
            key={study.id}
            className="grid-card"
            onClick={() => onOpen(study)}
          >
            <button
              className="favorite-button"
              onClick={(event) => {
                event.stopPropagation()
                toggleFavorite(study)
              }}
            >
              {study.isFavorite ? "\u2605" : "\u2606"}
            </button>
            <div className="grid-card-icon">{"\u265E"}</div>
            <div className="grid-card-title">{study.title}</div>
          </div>
        ))}
        {adding ? (
          <div className="grid-card add-card">
            <input
              className="add-input"
              value={newTitle}
              autoFocus
              placeholder="Name"
              onChange={(event) => setNewTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  saveNew()
                }
              }}
            />
            <button className="small-button" onClick={saveNew}>
              Save
            </button>
          </div>
        ) : (
          <div
            className="grid-card add-card"
            onClick={() => setAdding(true)}
          >
            <div className="add-plus">+</div>
          </div>
        )}
      </div>
    </div>
  )
}
