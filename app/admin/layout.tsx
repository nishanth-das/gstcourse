import { getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex bg-gray-50 min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
