import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./auth/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import HomePage from "./pages/HomePage"
import OpeningsPage from "./pages/OpeningsPage"
import OpeningDetailPage from "./pages/OpeningDetailPage"
import MiddleGamesPage from "./pages/MiddleGamesPage"
import EndGamesPage from "./pages/EndGamesPage"
import StudyDetailPage from "./pages/StudyDetailPage"
import ChessBoardPage from "./pages/ChessBoardPage"
import BookMovesPage from "./pages/BookMovesPage"
import UploadBoardPage from "./pages/UploadBoardPage"

function Guard({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<Guard><HomePage /></Guard>} />
          <Route path="/openings" element={<Guard><OpeningsPage /></Guard>} />
          <Route
            path="/openings/:title"
            element={<Guard><OpeningDetailPage /></Guard>}
          />
          <Route
            path="/middlegames"
            element={<Guard><MiddleGamesPage /></Guard>}
          />
          <Route path="/endgames" element={<Guard><EndGamesPage /></Guard>} />
          <Route
            path="/study/:category/:title"
            element={<Guard><StudyDetailPage /></Guard>}
          />
          <Route path="/board" element={<Guard><ChessBoardPage /></Guard>} />
          <Route
            path="/book-moves"
            element={<Guard><BookMovesPage /></Guard>}
          />
          <Route path="/upload" element={<Guard><UploadBoardPage /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
