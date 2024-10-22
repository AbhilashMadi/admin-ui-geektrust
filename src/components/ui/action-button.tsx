import { cn } from "@/utils/lib";
import { HTMLAttributes } from "react";

export function ActionButton(props: HTMLAttributes<HTMLButtonElement>) {
  const { children, className, ...rest } = props;

  return (<button className={cn("p-1 hover:text-white hover:bg-primary border border-dashed", className)} {...rest}>
    {children}
  </button>)
}