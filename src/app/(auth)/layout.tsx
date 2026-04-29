import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-charcoal soft-grid px-4 py-8">
      <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3 text-xl font-black text-white">
        <span className="h-10 w-10 rounded-2xl food-gradient" />
        Meu ZapPedido
      </Link>
      {children}
    </main>
  );
}
