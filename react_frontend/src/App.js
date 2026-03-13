import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

/**
 * Calculate the winner for a 3x3 tic-tac-toe board.
 * Returns null if no winner yet, otherwise returns an object containing:
 * - player: "X" | "O"
 * - line: number[] (indices of the winning line)
 */
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function isDraw(squares, winner) {
  return !winner && squares.every((s) => s != null);
}

// PUBLIC_INTERFACE
function App() {
  /** Retro theme can still use the template's theme system, but default to dark for retro neon vibe. */
  const [theme, setTheme] = useState("dark");

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const draw = useMemo(() => isDraw(squares, winner), [squares, winner]);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const currentPlayer = xIsNext ? "X" : "O";

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner.player}`;
    if (draw) return "It's a draw!";
    return `Next player: ${currentPlayer}`;
  }, [winner, draw, currentPlayer]);

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    // Ignore if game over or square already filled.
    if (winner || squares[index]) return;

    const next = squares.slice();
    next[index] = currentPlayer;
    setSquares(next);
    setXIsNext((v) => !v);
  }

  // PUBLIC_INTERFACE
  function restartRound() {
    // Keeps who starts next (i.e., if X is next, X will start again). Resets board only.
    setSquares(Array(9).fill(null));
  }

  // PUBLIC_INTERFACE
  function newGame() {
    // Resets everything to default "X starts".
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>

        <div className="ttt-shell" role="application" aria-label="Tic Tac Toe">
          <div className="ttt-header">
            <div className="ttt-titleWrap">
              <h1 className="ttt-title">TIC TAC TOE</h1>
              <p className="ttt-subtitle">Retro grid battle — first to 3 wins.</p>
            </div>

            <div className="ttt-scoreboard" aria-label="Current player indicators">
              <div className={`ttt-pill ${xIsNext && !winner && !draw ? "isActive" : ""}`}>
                <span className="ttt-pillLabel">X</span>
                <span className="ttt-pillText">Player 1</span>
              </div>
              <div className={`ttt-pill ${!xIsNext && !winner && !draw ? "isActive" : ""}`}>
                <span className="ttt-pillLabel">O</span>
                <span className="ttt-pillText">Player 2</span>
              </div>
            </div>
          </div>

          <div className="ttt-status" role="status" aria-live="polite">
            <span className={`ttt-statusBadge ${winner ? "isWin" : draw ? "isDraw" : ""}`}>
              {statusText}
            </span>
          </div>

          <div className="ttt-boardWrap">
            <div className="ttt-board" role="grid" aria-label="3 by 3 tic tac toe board">
              {squares.map((value, idx) => {
                const isWinning = Boolean(winner?.line.includes(idx));
                const isDisabled = Boolean(winner || value);

                return (
                  <button
                    key={idx}
                    type="button"
                    className={[
                      "ttt-cell",
                      value ? "isFilled" : "",
                      value === "X" ? "isX" : "",
                      value === "O" ? "isO" : "",
                      isWinning ? "isWinning" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleSquareClick(idx)}
                    disabled={Boolean(winner || value)}
                    role="gridcell"
                    aria-label={`Cell ${idx + 1}${value ? `, ${value}` : ""}${isWinning ? ", winning cell" : ""}`}
                  >
                    <span className="ttt-cellInner">{value}</span>
                    <span className="ttt-srOnly">
                      {isDisabled ? "Unavailable" : "Available"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="ttt-controls" aria-label="Game controls">
              <button className="ttt-btn ttt-btnPrimary" type="button" onClick={restartRound}>
                Restart Round
              </button>
              <button className="ttt-btn ttt-btnGhost" type="button" onClick={newGame}>
                New Game
              </button>
            </div>

            <p className="ttt-hint">
              Tip: The winning line will glow. Restart resets the board; New Game also resets turn to X.
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
