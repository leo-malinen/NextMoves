import { useParams } from "react-router-dom"
import NavBar from "../components/NavBar"

export default function StudyDetailPage() {
  const { title } = useParams()
  const decoded = decodeURIComponent(title)
  return (
    <div className="page">
      <NavBar title={decoded} />
      <div className="page-body center">
        <p className="detail-text">Learn more about: {decoded}</p>
      </div>
    </div>
  )
}
