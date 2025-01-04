import { type FC } from "react";
import Square from "./square";

type BoardProps = {
  onSquareClick: (i: number) => void;
  board: string[];
}

const Board: FC<BoardProps> = (props) => {
  const { onSquareClick, board } = props;

  return (<section>
    <ul>
      <li className="board-row after:content-[''] after:clear-both after:table">
        <Square value={board[0]} onClick={() => onSquareClick(0)} />
        <Square value={board[1]} onClick={() => onSquareClick(1)} />
        <Square value={board[2]} onClick={() => onSquareClick(2)} />
      </li>
      <li className="board-row after:content-[''] after:clear-both after:table">
        <Square value={board[3]} onClick={() => onSquareClick(3)} />
        <Square value={board[4]} onClick={() => onSquareClick(4)} />
        <Square value={board[5]} onClick={() => onSquareClick(5)} />
      </li>
      <li className="board-row after:content-[''] after:clear-both after:table">
        <Square value={board[6]} onClick={() => onSquareClick(6)} />
        <Square value={board[7]} onClick={() => onSquareClick(7)} />
        <Square value={board[8]} onClick={() => onSquareClick(8)} />
      </li>
    </ul>
  </section>)
}

export default Board;