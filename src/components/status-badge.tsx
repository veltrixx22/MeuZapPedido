import { cn } from "@/lib/utils";

const labels: Record<string, string> = {
  new: "Novo",
  accepted: "Aceito",
  preparing: "Preparando",
  out_for_delivery: "Saiu para entrega",
  completed: "Concluido",
  canceled: "Cancelado"
};

const styles: Record<string, string> = {
  new: "bg-orange-500/15 text-orange-200 border-orange-500/25",
  accepted: "bg-sky-500/15 text-sky-200 border-sky-500/25",
  preparing: "bg-yellow-500/15 text-yellow-100 border-yellow-500/25",
  out_for_delivery: "bg-purple-500/15 text-purple-200 border-purple-500/25",
  completed: "bg-emerald-500/15 text-emerald-200 border-emerald-500/25",
  canceled: "bg-red-500/15 text-red-200 border-red-500/25"
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", styles[status] ?? styles.new)}>
      {labels[status] ?? status}
    </span>
  );
}
