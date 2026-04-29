import { getOwnerBusiness } from "@/lib/data";
import { BusinessSettingsForm } from "@/components/manager-forms";
import { EmptyState } from "@/components/ui/card";

export default async function SettingsPage() {
  const business = await getOwnerBusiness();
  if (!business) return <EmptyState title="Loja nao encontrada" description="Nao encontramos uma loja vinculada a sua conta." />;
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black">Configuracoes</h1><p className="mt-1 text-sm text-zinc-400">Edite os dados publicos, entrega e WhatsApp da sua loja.</p></div>
      <BusinessSettingsForm business={business} />
    </div>
  );
}
