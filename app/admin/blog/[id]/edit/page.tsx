import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BlogPostEditClient from "./post-edit-client";

export default async function BlogPostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }

  const { id } = await params;
  const isNew = id === "new";

  const supabase = await createClient();
  const anySupabase = supabase as any;
  
  // Fetch categories
  const { data: categories } = await anySupabase
    .from("blog_categories")
    .select("id, name")
    .order("name", { ascending: true });

  let post = null;
  if (!isNew) {
    const { data } = await anySupabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();
    
    if (!data) {
      redirect("/admin/blog");
    }
    post = data;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isNew ? "Create New Blog Post" : `Edit Post: ${post.title}`}
        </h1>
        <p className="text-gray-500 mt-1">
          {isNew ? "Fill out the details below to write a new blog post." : "Update the details and content of this blog post."}
        </p>
      </div>

      <BlogPostEditClient initialPost={post} categories={categories || []} />
    </div>
  );
}
