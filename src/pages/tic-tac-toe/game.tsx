import { useState, type FC } from "react";
import { default as Board, default as board } from "./board";
import { i } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

export const calculateWinner = (squares: string[]): string | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of lines) {
    const [a, b, c] = combo;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }

  return null;
}

export enum SYMBOLS {
  X = "x",
  O = "o",
}

const Game: FC = () => {
  const [history, setHistory] = useState<string[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares) => {
    if (calculateWinner(board) || board[i]) return;
  }

  return <main className="min-h-screen flex-center">
    <Board board={board} onSquareClick={handleSquareClick} />
  </main>
}

export default Game;