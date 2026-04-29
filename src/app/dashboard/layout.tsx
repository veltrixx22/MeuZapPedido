import { Sidebar } from "@/components/sidebar";
import { requireUser } from "@/lib/data";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <div className="min-h-screen bg-charcoal text-white">
      <Sidebar />
      <main className="px-4 pb-10 pt-20 lg:ml-72 lg:px-8 lg:pt-8">{children}</main>
    </div>
  );
}
