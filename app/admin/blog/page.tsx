import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminBlogPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }

  const { status, category } = await searchParams;

  const supabase = await createClient();
  const anySupabase = supabase as any;
  
  // Fetch categories for filter dropdown
  const { data: categories } = await anySupabase
    .from("blog_categories")
    .select("id, name")
    .order("name", { ascending: true });

  // Fetch posts with filters
  let query = anySupabase
    .from("blog_posts")
    .select("id, title, slug, status, published_at, created_at, blog_categories(name)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }
  if (category) {
    query = query.eq("category_id", category);
  }

  const { data: posts } = await query;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 mt-1">Manage your blog articles.</p>
        </div>
        <Link href="/admin/blog/new/edit">
          <Button>+ New Post</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4">
        <form className="flex flex-col sm:flex-row gap-4 items-end flex-1">
          <div className="flex-1 max-w-xs w-full">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
            <select 
              name="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              defaultValue={(status as string) || ""}
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          
          <div className="flex-1 max-w-xs w-full">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
            <select 
              name="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              defaultValue={(category as string) || ""}
            >
              <option value="">All Categories</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <Button type="submit" className="h-10">Filter</Button>
          
          {(status || category) && (
            <Link href="/admin/blog">
              <Button variant="outline" className="h-10 text-gray-500">Clear</Button>
            </Link>
          )}
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {(!posts || posts.length === 0) ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No posts found</h3>
            <p className="text-gray-500">{(status || category) ? "Try adjusting your filters." : "Get started by writing a new post."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{post.title}</div>
                      <div className="text-xs text-gray-400 font-mono">/{post.slug}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {post.blog_categories?.name || <span className="text-gray-400 italic">None</span>}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <Link href={`/admin/blog/${post.id}/edit`} className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
