import Image from "next/image";
import { Edit3, Trash2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { currency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ProductCard({ product, onEdit, onDelete }: { product: Product; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative h-40 bg-mutedpanel">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">Sem imagem</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
          {product.is_available ? "Disponivel" : "Indisponivel"}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white">{product.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{product.description || "Sem descricao"}</p>
          </div>
          <strong className="text-orange-300">{currency(product.price)}</strong>
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onEdit}><Edit3 size={16} />Editar</Button>
          <Button type="button" variant="danger" onClick={onDelete}><Trash2 size={16} /></Button>
        </div>
      </div>
    </Card>
  );
}
