"use client";

import { useMemo, useState, useActionState, useTransition } from "react";
import { Search } from "lucide-react";
import { deleteCategoryAction, deleteProductAction, updateBusinessAction, upsertCategoryAction, upsertProductAction, updateOrderStatusAction } from "@/app/actions/business";
import type { ActionState } from "@/app/actions/auth";
import type { Business, Category, Order, Product } from "@/lib/types";
import { currency, dateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, EmptyState } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { CategoryCard } from "@/components/category-card";
import { StatusBadge } from "@/components/status-badge";

const initial: ActionState = { ok: false };

export function ProductsManager({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [state, action, pending] = useActionState(upsertProductAction, initial);
  const [, startTransition] = useTransition();
  const filtered = useMemo(() => products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) && (!category || p.category_id === category)
  ), [products, query, category]);

  return (
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <Card>
        <h2 className="text-xl font-black">{editing ? "Editar produto" : "Novo produto"}</h2>
        <form action={action} className="mt-5 space-y-4">
          <input type="hidden" name="id" value={editing?.id || ""} />
          <Field label="Nome" name="name" defaultValue={editing?.name} required />
          <div><Label>Descricao</Label><Textarea name="description" defaultValue={editing?.description || ""} /></div>
          <Field label="Preco" name="price" type="number" step="0.01" defaultValue={editing?.price} required />
          <div><Label>Categoria</Label><select name="category_id" defaultValue={editing?.category_id || ""} className="min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white"><option value="">Sem categoria</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>
          <Field label="URL da imagem" name="image_url" defaultValue={editing?.image_url || ""} />
          <label className="flex gap-2 text-sm text-zinc-300"><input type="checkbox" name="is_available" defaultChecked={editing?.is_available ?? true} />Disponivel</label>
          <label className="flex gap-2 text-sm text-zinc-300"><input type="checkbox" name="is_featured" defaultChecked={editing?.is_featured ?? false} />Destaque</label>
          {state.message ? <p className={`text-sm ${state.ok ? "text-emerald-300" : "text-red-300"}`}>{state.message}</p> : null}
          <div className="flex gap-2"><Button disabled={pending}>{pending ? "Salvando..." : "Salvar produto"}</Button>{editing ? <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button> : null}</div>
        </form>
      </Card>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-3 text-zinc-500" size={18} /><Input className="pl-10" placeholder="Buscar produto" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="min-h-11 rounded-xl border border-white/10 bg-panel px-3 text-sm text-white"><option value="">Todas categorias</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select>
        </div>
        {filtered.length ? <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} onEdit={() => setEditing(product)} onDelete={() => startTransition(() => { void deleteProductAction(product.id); })} />)}</div> : <EmptyState title="Nenhum produto cadastrado" description="Cadastre seus produtos para publicar seu cardapio." />}
      </div>
    </div>
  );
}

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [state, action, pending] = useActionState(upsertCategoryAction, initial);
  const [, startTransition] = useTransition();
  return (
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <Card>
        <h2 className="text-xl font-black">{editing ? "Editar categoria" : "Nova categoria"}</h2>
        <form action={action} className="mt-5 space-y-4">
          <input type="hidden" name="id" value={editing?.id || ""} />
          <Field label="Nome" name="name" defaultValue={editing?.name} required />
          <div><Label>Descricao</Label><Textarea name="description" defaultValue={editing?.description || ""} /></div>
          <label className="flex gap-2 text-sm text-zinc-300"><input type="checkbox" name="is_active" defaultChecked={editing?.is_active ?? true} />Ativa</label>
          {state.message ? <p className={`text-sm ${state.ok ? "text-emerald-300" : "text-red-300"}`}>{state.message}</p> : null}
          <div className="flex gap-2"><Button disabled={pending}>{pending ? "Salvando..." : "Salvar categoria"}</Button>{editing ? <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button> : null}</div>
        </form>
      </Card>
      {categories.length ? <div className="grid gap-4 md:grid-cols-2">{categories.map((cat) => <CategoryCard key={cat.id} category={cat} onEdit={() => setEditing(cat)} onDelete={() => startTransition(() => { void deleteCategoryAction(cat.id); })} />)}</div> : <EmptyState title="Nenhuma categoria cadastrada" description="Crie categorias como Lanches, Bebidas, Pizzas ou Combos." />}
    </div>
  );
}

export function BusinessSettingsForm({ business, appearanceOnly = false }: { business: Business; appearanceOnly?: boolean }) {
  const [state, action, pending] = useActionState(updateBusinessAction, initial);
  return (
    <Card className="max-w-4xl">
      <form action={action} className="grid gap-4 md:grid-cols-2">
        {!appearanceOnly ? (
          <>
            <Field label="Nome do negocio" name="name" defaultValue={business.name} required />
            <Field label="Slug do link" name="slug" defaultValue={business.slug} required />
            <Field label="WhatsApp" name="whatsapp_number" defaultValue={business.whatsapp_number} required />
            <Field label="Categoria" name="category" defaultValue={business.category || ""} />
            <div className="md:col-span-2"><Label>Descricao</Label><Textarea name="description" defaultValue={business.description || ""} /></div>
            <div className="md:col-span-2"><Label>Endereco</Label><Input name="address" defaultValue={business.address || ""} /></div>
            <Field label="Taxa de entrega" name="delivery_fee" type="number" step="0.01" defaultValue={business.delivery_fee} />
            <Field label="Pedido minimo" name="minimum_order" type="number" step="0.01" defaultValue={business.minimum_order} />
          </>
        ) : (
          <>
            <input type="hidden" name="name" value={business.name} /><input type="hidden" name="slug" value={business.slug} /><input type="hidden" name="whatsapp_number" value={business.whatsapp_number} />
            <input type="hidden" name="category" value={business.category || ""} /><input type="hidden" name="description" value={business.description || ""} /><input type="hidden" name="address" value={business.address || ""} />
            <input type="hidden" name="delivery_fee" value={business.delivery_fee} /><input type="hidden" name="minimum_order" value={business.minimum_order} />
          </>
        )}
        <Field label="Logo URL" name="logo_url" defaultValue={business.logo_url || ""} />
        <Field label="Banner URL" name="banner_url" defaultValue={business.banner_url || ""} />
        <Field label="Cor principal" name="primary_color" type="color" defaultValue={business.primary_color || "#ef4444"} />
        <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" name="is_open" defaultChecked={business.is_open} />Loja aberta</label>
        {state.message ? <p className={`md:col-span-2 text-sm ${state.ok ? "text-emerald-300" : "text-red-300"}`}>{state.message}</p> : null}
        <Button disabled={pending} className="md:col-span-2 w-fit">{pending ? "Salvando..." : "Salvar alteracoes"}</Button>
      </form>
    </Card>
  );
}

export function OrdersManager({ orders }: { orders: Order[] }) {
  const [, startTransition] = useTransition();
  if (!orders.length) return <EmptyState title="Nenhum pedido recebido" description="Quando clientes enviarem pedidos pelo cardapio, eles aparecerao aqui." />;
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id}>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
            <div><p className="font-semibold">#{order.id.slice(0, 8).toUpperCase()} - {order.customer_name}</p><p className="text-sm text-zinc-400">{order.customer_phone} - {dateTime(order.created_at)}</p><p className="mt-2 text-sm text-zinc-300">{order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}</p></div>
            <div><StatusBadge status={order.status} /><p className="mt-2 text-sm text-zinc-400">{order.delivery_type} - {currency(order.total)}</p></div>
            <select value={order.status} onChange={(e) => startTransition(() => { void updateOrderStatusAction(order.id, e.target.value); })} className="min-h-11 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white">
              <option value="new">Novo</option><option value="accepted">Aceito</option><option value="preparing">Preparando</option><option value="out_for_delivery">Saiu para entrega</option><option value="completed">Concluido</option><option value="canceled">Cancelado</option>
            </select>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...input } = props;
  return <div><Label>{label}</Label><Input {...input} /></div>;
}
