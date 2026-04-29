"use client";

import { QRCodeSVG } from "qrcode.react";
import { Copy, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareTools({ url, businessName }: { url: string; businessName: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-2xl border border-white/10 bg-panel p-5">
        <p className="text-sm text-zinc-400">Compartilhe este link com seus clientes para receber pedidos direto no WhatsApp.</p>
        <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-zinc-200">{url}</div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={() => navigator.clipboard.writeText(url)}><Copy size={18} />Copiar link</Button>
          <a href={url} target="_blank"><Button type="button" variant="secondary"><ExternalLink size={18} />Abrir menu</Button></a>
          <a href={`https://wa.me/?text=${encodeURIComponent(`Faca seu pedido no cardapio da ${businessName}: ${url}`)}`} target="_blank"><Button type="button" variant="secondary"><MessageCircle size={18} />Compartilhar no WhatsApp</Button></a>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white p-5">
        <QRCodeSVG value={url} size={235} />
      </div>
    </div>
  );
}
