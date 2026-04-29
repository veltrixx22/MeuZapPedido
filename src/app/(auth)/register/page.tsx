import Link from "next/link";
import { RegisterForm } from "@/components/auth-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <Card className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-black">Crie seu cardapio digital</h1>
      <p className="mt-2 text-sm text-zinc-400">Sua conta, sua loja e seu link de pedidos ficam prontos em poucos minutos.</p>
      <div className="mt-6"><RegisterForm /></div>
      <p className="mt-6 text-center text-sm text-zinc-400">
        Ja tem conta? <Link className="text-orange-300 hover:text-orange-200" href="/login">Entrar</Link>
      </p>
    </Card>
  );
}
