import { getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import BlogCategoriesClient from "./categories-client";

export default async function BlogCategoriesPage() {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Categories</h1>
        <p className="text-gray-500 mt-1">Manage categories for your blog posts.</p>
      </div>

      <BlogCategoriesClient />
    </div>
  );
}
