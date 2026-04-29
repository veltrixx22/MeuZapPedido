import { getDashboardData } from "@/lib/data";
import { OrdersManager } from "@/components/manager-forms";

export default async function OrdersPage() {
  const { orders } = await getDashboardData();
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black">Pedidos</h1><p className="mt-1 text-sm text-zinc-400">Acompanhe os pedidos recebidos pelo cardapio digital.</p></div>
      <OrdersManager orders={orders} />
    </div>
  );
}
