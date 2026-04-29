import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "food-gradient text-white shadow-glow hover:brightness-110",
        variant === "secondary" && "border border-white/10 bg-white/8 text-white hover:bg-white/12",
        variant === "ghost" && "text-zinc-300 hover:bg-white/8 hover:text-white",
        variant === "danger" && "bg-red-500/15 text-red-200 hover:bg-red-500/25",
        className
      )}
      {...props}
    />
  );
}
