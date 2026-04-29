import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function DashboardCard({ title, value, icon: Icon, helper }: { title: string; value: string | number; icon: LucideIcon; helper?: string }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <strong className="mt-2 block text-3xl text-white">{value}</strong>
          {helper ? <p className="mt-2 text-xs text-zinc-500">{helper}</p> : null}
        </div>
        <div className="rounded-2xl bg-white/8 p-3 text-orange-300">
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}
