import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth-form";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <Card className="mx-auto max-w-md">
      <h1 className="text-2xl font-black">Recuperar senha</h1>
      <p className="mt-2 text-sm text-zinc-400">Informe seu e-mail para receber as instrucoes.</p>
      <div className="mt-6"><ForgotPasswordForm /></div>
      <Link href="/login" className="mt-6 block text-center text-sm text-zinc-400 hover:text-white">Voltar para login</Link>
    </Card>
  );
}
