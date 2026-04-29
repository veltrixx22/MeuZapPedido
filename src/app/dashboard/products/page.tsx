import { getDashboardData } from "@/lib/data";
import { ProductsManager } from "@/components/manager-forms";

export default async function ProductsPage() {
  const { products, categories } = await getDashboardData();
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black">Produtos</h1><p className="mt-1 text-sm text-zinc-400">Cadastre, edite e organize os itens do seu cardapio.</p></div>
      <ProductsManager products={products} categories={categories} />
    </div>
  );
}
