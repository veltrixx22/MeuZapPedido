"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, Brush, FolderTree, LogOut, Menu, Settings, Share2, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { signOutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const items = [
  ["/dashboard", "Dashboard", BarChart3],
  ["/dashboard/products", "Produtos", Boxes],
  ["/dashboard/categories", "Categorias", FolderTree],
  ["/dashboard/orders", "Pedidos", ShoppingBag],
  ["/dashboard/appearance", "Aparencia", Brush],
  ["/dashboard/share", "Compartilhar", Share2],
  ["/dashboard/settings", "Configuracoes", Settings]
] as const;

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const nav = (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-[#111113] p-4">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 text-lg font-black"><span className="h-10 w-10 rounded-2xl food-gradient" />Meu ZapPedido</Link>
        <button className="lg:hidden" onClick={() => setOpen(false)}><X /></button>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map(([href, label, Icon]) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-white/8 hover:text-white", active && "bg-white/10 text-white")}>
              <Icon size={18} />{label}
            </Link>
          );
        })}
      </nav>
      <form action={signOutAction}>
        <Button variant="ghost" className="w-full justify-start"><LogOut size={18} />Sair</Button>
      </form>
    </aside>
  );
  return (
    <>
      <button className="fixed left-4 top-4 z-40 rounded-xl border border-white/10 bg-panel p-3 lg:hidden" onClick={() => setOpen(true)}><Menu /></button>
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block">{nav}</div>
      {open ? <div className="fixed inset-0 z-50 bg-black/60 lg:hidden"><div className="h-full">{nav}</div></div> : null}
    </>
  );
}
