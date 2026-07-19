import { useMemo, useState } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import NavBar from "../components/NavBar"

export default function ChessBoardPage() {
  const game = useMemo(() => new Chess(), [])
  const [fen, setFen] = useState(game.fen())
  const [history, setHistory] = useState([])

  const onDrop = (sourceSquare, targetSquare) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      })
      if (move === null) {
        return false
      }
      setFen(game.fen())
      setHistory(game.history())
      return true
    } catch (error) {
      return false
    }
  }

  const reset = () => {
    game.reset()
    setFen(game.fen())
    setHistory([])
  }

  const undo = () => {
    game.undo()
    setFen(game.fen())
    setHistory(game.history())
  }

  return (
    <div className="page">
      <NavBar title="Chess Board for Visualization" />
      <div className="page-body board-layout">
        <div className="board-wrapper">
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardWidth={360}
            customBoardStyle={{ borderRadius: "8px" }}
            customDarkSquareStyle={{ backgroundColor: "#b5732f" }}
            customLightSquareStyle={{ backgroundColor: "#f0d9b5" }}
          />
          <div className="board-controls">
            <button className="button" onClick={undo}>
              Undo
            </button>
            <button className="button" onClick={reset}>
              Reset Board
            </button>
          </div>
        </div>
        <div className="move-history">
          <h3>Moves</h3>
          <ol>
            {history.map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
