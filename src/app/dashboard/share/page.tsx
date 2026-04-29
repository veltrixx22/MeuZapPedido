import { getOwnerBusiness } from "@/lib/data";
import { appUrl } from "@/lib/utils";
import { ShareTools } from "@/components/share-tools";
import { EmptyState } from "@/components/ui/card";

export default async function SharePage() {
  const business = await getOwnerBusiness();
  if (!business) return <EmptyState title="Loja nao encontrada" description="Nao encontramos uma loja vinculada a sua conta." />;
  const url = `${appUrl()}/cardapio/${business.slug}`;
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black">Compartilhar</h1><p className="mt-1 text-sm text-zinc-400">Divulgue seu cardapio com link, WhatsApp ou QR Code.</p></div>
      <ShareTools url={url} businessName={business.name} />
    </div>
  );
}
