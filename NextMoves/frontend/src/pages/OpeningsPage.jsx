import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import StudyGrid from "../components/StudyGrid"

export default function OpeningsPage() {
  const navigate = useNavigate()
  return (
    <div className="page">
      <NavBar title="Openings" />
      <div className="page-body">
        <StudyGrid
          category="opening"
          onOpen={(study) =>
            navigate("/openings/" + encodeURIComponent(study.title))
          }
        />
      </div>
    </div>
  )
}
