import { getDashboardData } from "@/lib/data";
import { CategoriesManager } from "@/components/manager-forms";

export default async function CategoriesPage() {
  const { categories } = await getDashboardData();
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black">Categorias</h1><p className="mt-1 text-sm text-zinc-400">Agrupe produtos por tipo para facilitar a compra.</p></div>
      <CategoriesManager categories={categories} />
    </div>
  );
}
