import { MetadataRoute } from 'next';
import { getPublishedCourses, getCategories, getPublishedBlogPosts } from '@/lib/supabase/queries';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gstcourse.in';

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Dynamic Course Category Routes
    const categories = await getCategories();
    
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/courses/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Dynamic Course Detail Routes
    const courses = await getPublishedCourses();
    
    // To generate the full path we need the category slug for each course
    // Let's create a map of category_id to category slug
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.id, cat.slug);
      if (cat.children) {
        cat.children.forEach(child => {
          categoryMap.set(child.id, child.slug);
        });
      }
    });

    const courseRoutes: MetadataRoute.Sitemap = courses
      .map((course) => {
        const catSlug = course.category_id ? categoryMap.get(course.category_id) : 'uncategorized';
        
        return {
          url: `${baseUrl}/courses/${catSlug}/${course.slug}`,
          lastModified: new Date(course.created_at || new Date()),
          changeFrequency: 'weekly',
          priority: 0.8,
        };
      });

    // Dynamic Blog Post Routes
    const blogPosts = await getPublishedBlogPosts();
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...routes, ...categoryRoutes, ...courseRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the static routes if DB fetch fails
    return routes;
  }
}
