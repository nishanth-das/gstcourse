import { getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import CategoriesClient from "./categories-client";

export default async function CategoriesPage() {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 mt-1">Manage the course catalog categories and navigation menu.</p>
      </div>

      <CategoriesClient />
    </div>
  );
}
