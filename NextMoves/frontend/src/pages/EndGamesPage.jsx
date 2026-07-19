import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import StudyGrid from "../components/StudyGrid"

export default function EndGamesPage() {
  const navigate = useNavigate()
  return (
    <div className="page">
      <NavBar title="End Games" />
      <div className="page-body">
        <StudyGrid
          category="endgame"
          onOpen={(study) =>
            navigate("/study/endgame/" + encodeURIComponent(study.title))
          }
        />
      </div>
    </div>
  )
}
