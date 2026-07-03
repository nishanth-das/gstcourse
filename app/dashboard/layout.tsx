import { Container } from "@/components/ui/container";
import Link from "next/link";
import { getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-surface)] py-12">
      <Container>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-md text-sm font-medium text-[var(--color-text-dark)] hover:bg-gray-50 transition-colors"
                >
                  My Courses
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="px-4 py-2 rounded-md text-sm font-medium text-[var(--color-text-dark)] hover:bg-gray-50 transition-colors"
                >
                  Order History
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="px-4 py-2 rounded-md text-sm font-medium text-[var(--color-text-dark)] hover:bg-gray-50 transition-colors"
                >
                  Profile Settings
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
