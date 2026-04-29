import Link from "next/link";
import { Boxes, ClipboardList, FolderTree, LinkIcon, Plus, ShoppingBag } from "lucide-react";
import { getDashboardData } from "@/lib/data";
import { appUrl, currency, dateTime } from "@/lib/utils";
import { DashboardCard } from "@/components/dashboard-card";
import { Button } from "@/components/ui/button";
import { Card, EmptyState } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

export default async function DashboardPage() {
  const { business, categories, products, orders } = await getDashboardData();
  if (!business) {
    return <EmptyState title="Loja nao encontrada" description="Crie sua loja para comecar a vender pelo WhatsApp." />;
  }
  const link = `${appUrl()}/cardapio/${business.slug}`;
  const needsOnboarding = categories.length === 0 || products.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-orange-300">{business.category || "Negocio de comida"}</p>
          <h1 className="text-3xl font-black">{business.name}</h1>
          <p className="mt-1 text-sm text-zinc-400">{link}</p>
        </div>
        <span className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${business.is_open ? "bg-emerald-500/15 text-emerald-200" : "bg-red-500/15 text-red-200"}`}>
          {business.is_open ? "Aberto" : "Fechado"}
        </span>
      </div>

      {needsOnboarding ? (
        <Card>
          <h2 className="text-xl font-black">Checklist para publicar seu cardapio</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {[
              ["Cadastre sua primeira categoria", categories.length > 0],
              ["Cadastre seu primeiro produto", products.length > 0],
              ["Configure seu WhatsApp", Boolean(business.whatsapp_number)],
              ["Compartilhe seu link", false]
            ].map(([text, done]) => <div key={String(text)} className="rounded-xl bg-white/6 p-3 text-sm text-zinc-300">{done ? "OK" : "Pendente"} - {String(text)}</div>)}
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <DashboardCard title="Produtos" value={products.length} icon={Boxes} />
        <DashboardCard title="Categorias" value={categories.length} icon={FolderTree} />
        <DashboardCard title="Pedidos" value={orders.length} icon={ShoppingBag} />
        <DashboardCard title="Link publico" value="Ativo" icon={LinkIcon} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/dashboard/products"><Button className="w-full"><Plus size={18} />Add produto</Button></Link>
        <Link href="/dashboard/categories"><Button variant="secondary" className="w-full"><Plus size={18} />Add categoria</Button></Link>
        <Link href="/dashboard/share"><Button variant="secondary" className="w-full"><ClipboardList size={18} />Copiar link</Button></Link>
        <Link href={`/cardapio/${business.slug}`} target="_blank"><Button variant="secondary" className="w-full">Abrir cardapio</Button></Link>
      </div>

      <Card>
        <h2 className="mb-4 text-xl font-black">Ultimos pedidos</h2>
        {orders.length ? (
          <div className="space-y-3">
            {orders.slice(0, 6).map((order) => (
              <div key={order.id} className="flex flex-col justify-between gap-3 rounded-xl bg-white/6 p-4 md:flex-row md:items-center">
                <div>
                  <p className="font-semibold">#{order.id.slice(0, 8).toUpperCase()} - {order.customer_name}</p>
                  <p className="text-sm text-zinc-400">{dateTime(order.created_at)} - {order.delivery_type}</p>
                </div>
                <div className="flex items-center gap-3"><StatusBadge status={order.status} /><strong>{currency(order.total)}</strong></div>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-zinc-400">Nenhum pedido recebido ainda.</p>}
      </Card>
    </div>
  );
}
