import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import NavBar from "../components/NavBar"
import { api } from "../api"

export default function OpeningDetailPage() {
  const { title } = useParams()
  const decoded = decodeURIComponent(title)
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .openingUrl(decoded)
      .then((data) => setUrl(data.url))
      .catch((err) => setError(err.message))
  }, [decoded])

  return (
    <div className="page">
      <NavBar title={decoded} />
      <div className="page-body center">
        <p className="detail-text">Learn more about {decoded}:</p>
        {error && <div className="error-text">{error}</div>}
        {url && (
          <a
            className="button"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            Visit Chess.com
          </a>
        )}
      </div>
    </div>
  )
}
