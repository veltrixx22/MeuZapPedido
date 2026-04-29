"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { createPublicOrder } from "@/app/actions/orders";
import type { Business, Category, OrderItem, Product } from "@/lib/types";
import { currency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function PublicMenu({ business, categories, products }: { business: Business; categories: Category[]; products: Product[] }) {
  const [active, setActive] = useState("all");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [openCart, setOpenCart] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const filtered = active === "all" ? products : products.filter((p) => p.category_id === active);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + Number(business.delivery_fee || 0);

  function add(product: Product) {
    setCart((items) => {
      const found = items.find((item) => item.id === product.id);
      if (found) return items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { id: product.id, name: product.name, price: Number(product.price), quantity: 1 }];
    });
    setOpenCart(true);
  }

  function qty(id: string, delta: number) {
    setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  }

  function submit(formData: FormData) {
    setMessage("");
    const checkout = Object.fromEntries(formData) as Record<string, string>;
    startTransition(async () => {
      const result = await createPublicOrder({ business, items: cart, checkout });
      if (!result.ok) setMessage(result.message || "Verifique os dados do pedido.");
      if (result.ok && result.url) window.location.href = result.url;
    });
  }

  const featured = useMemo(() => products.filter((p) => p.is_featured), [products]);

  return (
    <main className="min-h-screen bg-[#0f0f10] text-white">
      <header className="relative">
        <div className="relative h-56 bg-mutedpanel md:h-72">
          {business.banner_url ? <Image src={business.banner_url} alt={business.name} fill className="object-cover opacity-80" priority /> : <div className="h-full food-gradient opacity-80" />}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
        </div>
        <div className="mx-auto -mt-16 max-w-7xl px-4 pb-6">
          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-3xl border-4 border-charcoal bg-panel">
                {business.logo_url ? <Image src={business.logo_url} alt={business.name} fill className="object-cover" /> : <div className="h-full food-gradient" />}
              </div>
              <div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${business.is_open ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"}`}>{business.is_open ? "Aberto agora" : "Fechado no momento"}</span>
                <h1 className="mt-2 text-3xl font-black">{business.name}</h1>
                <p className="text-sm text-zinc-400">{business.category} {business.delivery_fee ? `- Entrega ${currency(business.delivery_fee)}` : ""}</p>
              </div>
            </div>
            {business.minimum_order > 0 ? <p className="rounded-xl bg-white/8 px-4 py-2 text-sm text-zinc-300">Pedido minimo: {currency(business.minimum_order)}</p> : null}
          </div>
          {business.description ? <p className="mt-5 max-w-3xl text-zinc-300">{business.description}</p> : null}
          {!business.is_open ? <p className="mt-4 rounded-xl border border-orange-500/25 bg-orange-500/10 p-3 text-sm text-orange-100">Este estabelecimento esta fechado no momento, mas voce ainda pode visualizar o cardapio.</p> : null}
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-28 lg:grid-cols-[1fr_390px] lg:pb-10">
        <section>
          <div className="sticky top-0 z-20 -mx-4 overflow-x-auto border-y border-white/10 bg-charcoal/95 px-4 py-3 backdrop-blur">
            <div className="flex gap-2">
              <button onClick={() => setActive("all")} className={`rounded-full px-4 py-2 text-sm font-semibold ${active === "all" ? "food-gradient text-white" : "bg-white/8 text-zinc-300"}`}>Todos</button>
              {categories.map((cat) => <button key={cat.id} onClick={() => setActive(cat.id)} className={`rounded-full px-4 py-2 text-sm font-semibold ${active === cat.id ? "food-gradient text-white" : "bg-white/8 text-zinc-300"}`}>{cat.name}</button>)}
            </div>
          </div>
          {featured.length && active === "all" ? <h2 className="mb-4 mt-6 text-xl font-black">Destaques</h2> : null}
          {!products.length ? <div className="mt-8 rounded-2xl border border-white/10 bg-panel p-8 text-center text-zinc-300">Este cardapio ainda nao possui produtos cadastrados.</div> : null}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {filtered.map((product) => (
              <article key={product.id} className="flex gap-4 rounded-2xl border border-white/10 bg-panel p-3">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-mutedpanel">
                  {product.image_url ? <Image src={product.image_url} alt={product.name} fill className="object-cover" /> : <div className="h-full food-gradient opacity-70" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{product.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-2"><strong className="text-orange-300">{currency(product.price)}</strong><Button type="button" className="min-h-9 px-3" onClick={() => add(product)}><Plus size={16} /></Button></div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <CartPanel className="hidden lg:block" cart={cart} subtotal={subtotal} total={total} deliveryFee={business.delivery_fee} qty={qty} submit={submit} pending={pending} message={message} />
      </div>
      <button onClick={() => setOpenCart(true)} className="fixed bottom-4 left-4 right-4 z-30 flex items-center justify-center gap-2 rounded-2xl food-gradient px-4 py-4 font-bold shadow-glow lg:hidden">
        <ShoppingCart size={20} />Ver carrinho - {currency(subtotal)}
      </button>
      {openCart ? <div className="fixed inset-0 z-40 bg-black/70 p-4 lg:hidden"><CartPanel cart={cart} subtotal={subtotal} total={total} deliveryFee={business.delivery_fee} qty={qty} submit={submit} pending={pending} message={message} close={() => setOpenCart(false)} /></div> : null}
    </main>
  );
}

function CartPanel({ cart, subtotal, total, deliveryFee, qty, submit, pending, message, close, className }: {
  cart: OrderItem[]; subtotal: number; total: number; deliveryFee: number; qty: (id: string, delta: number) => void; submit: (formData: FormData) => void; pending: boolean; message: string; close?: () => void; className?: string;
}) {
  return (
    <aside className={className}>
      <form action={submit} className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-white/10 bg-panel p-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">Seu pedido</h2>{close ? <button type="button" onClick={close} className="text-zinc-400">Fechar</button> : null}</div>
        {!cart.length ? <p className="rounded-xl bg-white/6 p-4 text-sm text-zinc-400">Seu carrinho esta vazio.</p> : null}
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="rounded-xl bg-white/6 p-3">
              <div className="flex justify-between gap-3"><p className="font-semibold">{item.name}</p><button type="button" onClick={() => qty(item.id, -item.quantity)}><Trash2 size={16} /></button></div>
              <div className="mt-2 flex items-center justify-between"><span className="text-sm text-zinc-400">{currency(item.price)}</span><div className="flex items-center gap-2"><button type="button" onClick={() => qty(item.id, -1)}><Minus size={16} /></button><span>{item.quantity}</span><button type="button" onClick={() => qty(item.id, 1)}><Plus size={16} /></button></div></div>
            </div>
          ))}
        </div>
        <div className="my-5 space-y-2 border-y border-white/10 py-4 text-sm">
          <p className="flex justify-between text-zinc-300"><span>Subtotal</span><strong>{currency(subtotal)}</strong></p>
          <p className="flex justify-between text-zinc-300"><span>Entrega</span><strong>{currency(deliveryFee)}</strong></p>
          <p className="flex justify-between text-base text-white"><span>Total</span><strong>{currency(total)}</strong></p>
        </div>
        <div className="space-y-3">
          <Field label="Nome" name="customer_name" required />
          <Field label="Telefone" name="customer_phone" required />
          <div><Label>Tipo de pedido</Label><select name="delivery_type" className="min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white"><option>Entrega</option><option>Retirada</option></select></div>
          <Field label="Endereco" name="address" />
          <div><Label>Pagamento</Label><select name="payment_method" className="min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white"><option>PIX</option><option>Dinheiro</option><option>Cartao</option></select></div>
          <Field label="Troco para" name="change_for" />
          <div><Label>Observacoes</Label><Textarea name="notes" /></div>
        </div>
        {message ? <p className="mt-4 rounded-xl bg-red-500/15 p-3 text-sm text-red-200">{message}</p> : null}
        <Button disabled={pending || !cart.length} className="mt-5 w-full">{pending ? "Enviando..." : "Enviar pedido no WhatsApp"}</Button>
      </form>
    </aside>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...input } = props;
  return <div><Label>{label}</Label><Input {...input} /></div>;
}
