import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-white/10 bg-panel p-5 shadow-2xl shadow-black/20", className)}>{children}</div>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <Card className="flex min-h-56 flex-col items-center justify-center text-center">
      <div className="mb-3 h-12 w-12 rounded-2xl food-gradient opacity-90" />
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-zinc-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}

export function LoadingState() {
  return <div className="rounded-2xl border border-white/10 bg-panel p-6 text-sm text-zinc-400">Carregando...</div>;
}
