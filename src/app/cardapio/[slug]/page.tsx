import { notFound } from "next/navigation";
import { getPublicMenu } from "@/lib/data";
import { PublicMenu } from "@/components/public-menu";

export default async function PublicMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublicMenu(slug);
  if (!data) notFound();
  return <PublicMenu {...data} />;
}

export function generateMetadata() {
  return { title: "Cardapio - Meu ZapPedido" };
}
