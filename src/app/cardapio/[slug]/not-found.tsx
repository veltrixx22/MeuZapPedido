import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MenuNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal px-4 text-white">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-3xl food-gradient" />
        <h1 className="text-3xl font-black">Cardapio nao encontrado</h1>
        <p className="mt-3 text-zinc-400">Verifique se o link esta correto ou entre em contato com o estabelecimento.</p>
        <Link href="/" className="mt-6 inline-flex"><Button>Voltar ao inicio</Button></Link>
      </div>
    </main>
  );
}
