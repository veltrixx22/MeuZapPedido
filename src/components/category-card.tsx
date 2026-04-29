import { Edit3, Trash2 } from "lucide-react";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CategoryCard({ category, onEdit, onDelete }: { category: Category; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white">{category.name}</h3>
          <p className="mt-1 text-sm text-zinc-400">{category.description || "Sem descricao"}</p>
          <span className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
            {category.is_active ? "Ativa" : "Inativa"}
          </span>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onEdit}><Edit3 size={16} /></Button>
          <Button type="button" variant="danger" onClick={onDelete}><Trash2 size={16} /></Button>
        </div>
      </div>
    </Card>
  );
}
