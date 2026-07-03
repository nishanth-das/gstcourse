import { getCoursesByCategory, getCategories } from "@/lib/supabase/queries";
import { CourseCatalog } from "@/components/CourseCatalog";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ "category-slug": string }> }): Promise<Metadata> {
  const { "category-slug": categorySlug } = await params;
  const categories = await getCategories();
  
  let categoryName = "Category";
  categories.forEach(c => {
    if (c.slug === categorySlug) categoryName = c.name;
    c.children?.forEach(child => {
      if (child.slug === categorySlug) categoryName = child.name;
    });
  });

  return {
    title: `${categoryName} Courses | GST Courses.in`,
    description: `Browse our ${categoryName} courses.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ "category-slug": string }> }) {
  const { "category-slug": categorySlug } = await params;
  
  const [courses, categories] = await Promise.all([
    getCoursesByCategory(categorySlug),
    getCategories()
  ]);

  let categoryName = "Category";
  categories.forEach(c => {
    if (c.slug === categorySlug) categoryName = c.name;
    c.children?.forEach(child => {
      if (child.slug === categorySlug) categoryName = child.name;
    });
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gstcourse.in';
  
  const jsonLd = {
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CourseCatalog 
        initialCourses={courses} 
        categories={categories} 
        title={`${categoryName} Courses`}
      />
    </>
  );
}
