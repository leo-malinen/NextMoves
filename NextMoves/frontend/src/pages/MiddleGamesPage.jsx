import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import StudyGrid from "../components/StudyGrid"

export default function MiddleGamesPage() {
  const navigate = useNavigate()
  return (
    <div className="page">
      <NavBar title="Middle Games" />
      <div className="page-body">
        <StudyGrid
          category="middlegame"
          onOpen={(study) =>
            navigate(
              "/study/middlegame/" + encodeURIComponent(study.title)
            )
          }
        />
      </div>
    </div>
  )
}
