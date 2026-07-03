import { getPublishedBlogPosts } from "@/lib/supabase/queries";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Blog | GST Courses.in",
  description: "Stay up-to-date with the latest GST news, tax updates, and accounting tips in India.",
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Tax Updates & Insights
          </h1>
          <p className="text-lg text-gray-600">
            Expert articles, news, and tips on GST compliance, tax returns, and accounting in India.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Check back soon!</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We're currently writing fresh, high-quality content for you. Stay tuned.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link 
                href={`/blog/${post.slug}`} 
                key={post.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                  {post.cover_image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={post.cover_image_url} 
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 to-gray-200">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {post.blog_categories?.name && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur text-[var(--color-primary)] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                        {post.blog_categories.name}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs text-gray-500 font-medium mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  
                  {post.excerpt && (
                    <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <span className="text-[var(--color-primary)] font-semibold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                      Read Article
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
