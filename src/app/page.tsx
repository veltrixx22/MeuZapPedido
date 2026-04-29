import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, Smartphone, Store, Tags, Utensils, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const benefits = [
  ["Sem comissao por pedido", WalletCards],
  ["Pedido direto no WhatsApp", MessageCircle],
  ["Link personalizado da sua loja", Store],
  ["Facil de cadastrar produtos", Tags],
  ["Funciona no celular", Smartphone],
  ["Ideal para pequenos negocios", Utensils]
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-charcoal text-white">
      <section className="soft-grid border-b border-white/10 px-4">
        <nav className="mx-auto flex max-w-7xl items-center justify-between py-5">
          <div className="flex items-center gap-3 text-xl font-black"><span className="h-10 w-10 rounded-2xl food-gradient" />Meu ZapPedido</div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm text-zinc-300 hover:text-white sm:block">Entrar</Link>
            <Link href="/register"><Button>Comecar agora</Button></Link>
          </div>
        </nav>
        <div className="mx-auto grid max-w-7xl items-center gap-10 py-16 md:grid-cols-[1fr_0.9fr] md:py-24">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-orange-400/25 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200">
              Cardapio digital para vender pelo WhatsApp
            </p>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">Seu cardapio digital com pedidos direto no WhatsApp</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Crie seu cardapio online, receba pedidos organizados e venda mais sem pagar taxas abusivas de aplicativos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register"><Button className="w-full sm:w-auto">Comecar agora <ArrowRight size={18} /></Button></Link>
              <Link href="/cardapio/exemplo"><Button variant="secondary" className="w-full sm:w-auto">Ver exemplo de cardapio</Button></Link>
            </div>
          </div>
          <div className="glass-panel rounded-[2rem] p-4 shadow-glow">
            <div className="rounded-[1.5rem] bg-[#111113] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div><p className="text-sm text-zinc-400">Pedidos hoje</p><strong className="text-3xl">27</strong></div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200">Aberto</span>
              </div>
              <div className="grid gap-3">
                {["X-Bacon Artesanal", "Pizza Calabresa", "Acai 500ml"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/6 p-3">
                    <div className="h-14 w-14 rounded-2xl food-gradient opacity-80" />
                    <div className="flex-1"><p className="font-semibold">{item}</p><p className="text-sm text-zinc-400">{index + 1}x no pedido</p></div>
                    <span className="text-orange-300">R$ {index === 0 ? "29,90" : "42,00"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(([title, Icon]) => (
            <Card key={String(title)}>
              <Icon className="text-orange-300" />
              <h3 className="mt-4 font-bold">{String(title)}</h3>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-mutedpanel px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black">Como funciona</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {["Crie sua conta", "Cadastre seu cardapio", "Compartilhe seu link", "Receba pedidos no WhatsApp"].map((step, idx) => (
              <div key={step} className="rounded-2xl border border-white/10 p-5">
                <span className="food-gradient flex h-10 w-10 items-center justify-center rounded-xl font-black">{idx + 1}</span>
                <p className="mt-4 font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-black">Planos simples</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            ["Plano Inicial", "R$ 19,90/mes", ["1 loja", "Produtos ilimitados", "Pedidos via WhatsApp", "Link personalizado"]],
            ["Plano Pro", "R$ 29,90/mes", ["Tudo do Inicial", "Personalizacao visual", "Relatorios basicos", "Suporte prioritario"]]
          ].map(([name, price, items]) => (
            <Card key={String(name)} className="p-7">
              <h3 className="text-xl font-black">{String(name)}</h3>
              <p className="mt-3 text-4xl font-black text-orange-300">{String(price)}</p>
              <div className="mt-6 space-y-3">
                {(items as string[]).map((item) => <p key={item} className="flex gap-2 text-zinc-300"><CheckCircle2 className="text-emerald-300" size={18} />{item}</p>)}
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">Em breve: pagamento automatico via PIX/Mercado Pago.</p>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] food-gradient p-8 text-center shadow-glow">
          <h2 className="text-3xl font-black">Comece hoje e transforme seu WhatsApp em uma maquina de pedidos.</h2>
          <Link href="/register" className="mt-6 inline-flex"><Button variant="secondary">Criar minha loja</Button></Link>
        </div>
      </section>
    </main>
  );
}
