import { Circle, X } from "lucide-react";
import { type FC } from "react";
import { SYMBOLS } from "./game";

type SquareProps = {
  value: string;
  onClick: () => void;
}

const Square: FC<SquareProps> = ({ value, onClick }) => {

  return (<button onClick={onClick} value={value} className="border border-primary/[0.2] active:bg-primary -mt-px -ml-px size-16 bg-orange-50 float-left">
    {value === SYMBOLS.X && <X />}
    {value === SYMBOLS.O && <Circle />}
  </button>)
}

export default Square;