import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { api, API_ORIGIN } from "../api"

const DEFAULT_DESCRIPTION =
  "In many Chess.com positions, controlling the center, rapid development, and solid pawn structure are key principles. Analyze the balance of your pieces, look for tactical opportunities, and plan your next moves accordingly."

export default function UploadBoardPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState("")
  const [uploads, setUploads] = useState([])
  const [message, setMessage] = useState("")

  const load = () => {
    api.uploads().then((data) => setUploads(data.uploads))
  }

  useEffect(() => {
    load()
  }, [])

  const onFileChange = (event) => {
    const selected = event.target.files[0]
    setFile(selected || null)
    setPreview(selected ? URL.createObjectURL(selected) : "")
  }

  const submit = async () => {
    if (!file) {
      setMessage("Please choose a board image first.")
      return
    }
    const formData = new FormData()
    formData.append("image", file)
    formData.append("description", DEFAULT_DESCRIPTION)
    await api.uploadBoard(formData)
    setMessage("Image captured.")
    setFile(null)
    setPreview("")
    load()
  }

  return (
    <div className="page">
      <NavBar title="Upload a Board" />
      <div className="page-body">
        <p className="detail-text">{DEFAULT_DESCRIPTION}</p>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFileChange}
        />
        {preview && (
          <img className="preview" src={preview} alt="Selected board" />
        )}
        <button className="button" onClick={submit}>
          Upload Board
        </button>
        {message && <div className="info-text">{message}</div>}
        <h3>Your Boards</h3>
        <div className="upload-list">
          {uploads.map((upload) => (
            <div key={upload.id} className="upload-item">
              <img src={API_ORIGIN + upload.url} alt="Uploaded board" />
              <p>{upload.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
