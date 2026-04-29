import Link from "next/link";
import { LoginForm } from "@/components/auth-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="mx-auto max-w-md">
      <h1 className="text-2xl font-black">Entrar no painel</h1>
      <p className="mt-2 text-sm text-zinc-400">Acesse sua loja e gerencie seus pedidos.</p>
      <div className="mt-6"><LoginForm /></div>
      <p className="mt-6 text-center text-sm text-zinc-400">
        Ainda nao tem conta? <Link className="text-orange-300 hover:text-orange-200" href="/register">Comecar agora</Link>
      </p>
    </Card>
  );
}
