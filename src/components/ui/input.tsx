import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orangefire/70 focus:ring-2 focus:ring-orangefire/20",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orangefire/70 focus:ring-2 focus:ring-orangefire/20",
        className
      )}
      {...props}
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-sm font-medium text-zinc-300">{children}</label>;
}
