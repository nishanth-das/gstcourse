import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import DOMPurify from 'isomorphic-dompurify';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt;

  return {
    title: `${title} | GST Courses.in`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: ["GST Courses.in"],
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch recent posts for the "Related Posts" section
  const allPosts = await getPublishedBlogPosts();
  const relatedPosts = allPosts.filter((p: any) => p.id !== post.id).slice(0, 3);

  const cleanContent = DOMPurify.sanitize(post.content);

  // Generate JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.meta_title || post.title,
    "description": post.meta_description || post.excerpt,
    "image": post.cover_image_url ? [post.cover_image_url] : [],
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Organization",
      "name": "GST Courses.in"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white min-h-screen">
        <Container>
          <article className="max-w-4xl mx-auto py-16 lg:py-24">
            
            {/* Header */}
            <header className="mb-12 text-center">
              {post.blog_categories?.name && (
                <div className="mb-4">
                  <span className="bg-gray-100 text-[var(--color-primary)] px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-full">
                    {post.blog_categories.name}
                  </span>
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-center text-sm font-medium text-gray-500">
                <svg className="w-5 h-5 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </div>
            </header>

            {/* Cover Image */}
            {post.cover_image_url && (
              <div className="mb-16 rounded-3xl overflow-hidden shadow-lg border border-gray-100 aspect-video relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.cover_image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg sm:prose-xl mx-auto prose-a:text-[var(--color-primary)] prose-a:no-underline hover:prose-a:underline prose-headings:font-bold prose-headings:tracking-tight prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />

            {/* End of article CTA */}
            <div className="mt-16 bg-gray-50 rounded-2xl p-8 md:p-12 text-center border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Want to master GST compliance?</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of students and professionals who have transformed their careers with our practical, hands-on GST courses.
              </p>
              <Link 
                href="/courses" 
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
              >
                Explore Courses
              </Link>
            </div>

          </article>
        </Container>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-100 py-16">
            <Container>
              <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Read More Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {relatedPosts.map((rp: any) => (
                  <Link 
                    href={`/blog/${rp.slug}`} 
                    key={rp.id}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                      {rp.cover_image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                          src={rp.cover_image_url} 
                          alt={rp.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200" />
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      <div className="mt-auto text-sm text-gray-500 font-medium">
                        {new Date(rp.published_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </div>
        )}
      </div>
    </>
  );
}
