import { getCourseBySlug, getCourseCurriculum, getCategories } from "@/lib/supabase/queries";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CurriculumAccordion } from "@/components/CurriculumAccordion";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, BarChart, Globe } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ "course-slug": string }> }): Promise<Metadata> {
  const { "course-slug": courseSlug } = await params;
  const course = await getCourseBySlug(courseSlug);
  
  if (!course) return { title: "Course Not Found" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gstcourse.in';

  return {
    title: `${course.title} | GST Courses.in`,
    description: course.short_description || undefined,
    openGraph: {
      title: course.title,
      description: course.short_description || undefined,
      images: course.thumbnail_url ? [{ url: course.thumbnail_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.short_description || undefined,
      images: course.thumbnail_url ? [course.thumbnail_url] : [],
    }
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ "category-slug": string, "course-slug": string }> }) {
  const { "category-slug": categorySlug, "course-slug": courseSlug } = await params;
  
  const [course, categories] = await Promise.all([
    getCourseBySlug(courseSlug),
    getCategories()
  ]);

  if (!course) {
    notFound();
  }

  const curriculum = await getCourseCurriculum(course.id);

  let categoryName = "Category";
  categories.forEach(c => {
    if (c.slug === categorySlug) categoryName = c.name;
    c.children?.forEach(child => {
      if (child.slug === categorySlug) categoryName = child.name;
    });
  });

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: course.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(course.price);

  const hasDiscount = course.compare_at_price && course.compare_at_price > course.price;
  const formattedComparePrice = hasDiscount 
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: course.currency || 'INR',
        maximumFractionDigits: 0,
      }).format(course.compare_at_price!)
    : null;
    
  const discountPercent = hasDiscount
    ? Math.round(((course.compare_at_price! - course.price) / course.compare_at_price!) * 100)
    : 0;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gstcourse.in';

  const jsonLdCourse = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.short_description,
    provider: {
      '@type': 'Organization',
      name: 'GST Courses.in',
      sameAs: baseUrl,
    },
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: course.currency || 'INR',
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Courses',
        item: `${baseUrl}/courses`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `${baseUrl}/courses/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: course.title,
        item: `${baseUrl}/courses/${categorySlug}/${course.slug}`,
      },
    ],
  };

  return (
    <div className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCourse) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {/* Course Hero */}
      <section className="bg-[var(--color-surface)] py-12 md:py-20 border-b border-gray-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-sm text-[var(--color-charcoal)] font-medium">
                <Link href="/courses" className="hover:text-[var(--color-primary)]">Courses</Link>
                <span>/</span>
                <Link href={`/courses/${categorySlug}`} className="hover:text-[var(--color-primary)]">{categoryName}</Link>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--color-text-dark)] tracking-tight">
                {course.title}
              </h1>
              
              <p className="text-lg text-[var(--color-charcoal)] leading-relaxed">
                {course.short_description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-4">
                {course.level && (
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-charcoal)]">
                    <BarChart className="w-5 h-5 text-[var(--color-primary)]" />
                    <span>{course.level}</span>
                  </div>
                )}
                {course.language && (
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-charcoal)]">
                    <Globe className="w-5 h-5 text-[var(--color-primary)]" />
                    <span>{course.language}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-charcoal)]">
                  <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                  <span>Self-paced</span>
                </div>
              </div>
            </div>
            
            {/* Sales Card (Desktop) */}
            <div className="hidden lg:block relative">
              <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="aspect-video w-full bg-gray-100">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                      No Thumbnail
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    {hasDiscount && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl text-gray-400 line-through font-medium">
                          {formattedComparePrice}
                        </span>
                        <Badge variant="error" className="bg-red-500 hover:bg-red-600">
                          {discountPercent}% OFF
                        </Badge>
                      </div>
                    )}
                    <div className="text-3xl font-extrabold text-[var(--color-text-dark)]">
                      {formattedPrice}
                    </div>
                  </div>
                  <Link href={`/checkout/${course.slug}`}>
                    <Button size="lg" className="w-full text-lg h-12 mb-4">
                      Buy Now
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-gray-500">
                    Secure checkout powered by Razorpay. Lifetime access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              
              {/* Sales Card (Mobile) - only visible on small screens */}
              <div className="lg:hidden bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8">
                 <div className="aspect-video w-full bg-gray-100">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                      No Thumbnail
                    </div>
                  )}
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    {hasDiscount && (
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm text-gray-400 line-through">
                          {formattedComparePrice}
                        </span>
                        <span className="text-xs font-bold text-red-500">
                          {discountPercent}% OFF
                        </span>
                      </div>
                    )}
                    <div className="text-2xl font-extrabold text-[var(--color-text-dark)]">
                      {formattedPrice}
                    </div>
                  </div>
                  <Link href={`/checkout/${course.slug}`}>
                    <Button size="lg">Buy Now</Button>
                  </Link>
                </div>
              </div>

              {/* What you'll learn (Placeholder since we don't have a structured field yet) */}
              <div className="bg-[var(--color-surface)] rounded-xl p-8 border border-gray-200">
                <h2 className="text-xl font-bold text-[var(--color-text-dark)] mb-6">What You Will Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Practical insights into GST concepts",
                    "Step-by-step return filing demos",
                    "Handling real-world accounting scenarios",
                    "Avoiding common compliance mistakes"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                      <span className="text-[var(--color-text-dark)] text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-dark)] mb-6">Course Curriculum</h2>
                <CurriculumAccordion modules={curriculum} />
              </div>

              {/* Description & What you'll learn */}
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-dark)] mb-6">About This Course</h2>
                <div 
                  className="prose max-w-none text-[var(--color-charcoal)] prose-p:my-3 prose-ul:my-3 prose-li:my-1 prose-headings:mb-3 prose-headings:mt-6 marker:text-gray-400" 
                  dangerouslySetInnerHTML={{ __html: course.long_description || "" }} 
                />
              </div>

            </div>
          </div>
        </Container>
      </section>
      
      {/* Mobile Sticky Buy Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 flex items-center justify-between">
        <div>
          {hasDiscount && (
            <div className="text-xs text-gray-400 line-through font-medium">
              {formattedComparePrice}
            </div>
          )}
          <div className="text-xl font-extrabold text-[var(--color-text-dark)] leading-none">
            {formattedPrice}
          </div>
        </div>
        <Link href={`/checkout/${course.slug}`}>
          <Button size="lg" className="px-8 shadow-sm">Buy Now</Button>
        </Link>
      </div>
    </div>
  );
}
