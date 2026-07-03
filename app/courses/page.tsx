import { getPublishedCourses, getCategories } from "@/lib/supabase/queries";
import { CourseCatalog } from "@/components/CourseCatalog";

export const metadata = {
  title: "All Courses | GST Courses.in",
  description: "Browse our complete catalog of GST, taxation, and accounting courses.",
};

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    getPublishedCourses(),
    getCategories()
  ]);

  return (
    <CourseCatalog 
      initialCourses={courses} 
      categories={categories} 
      title="All Courses"
      description="Browse our complete catalog of practical training programs."
    />
  );
}
