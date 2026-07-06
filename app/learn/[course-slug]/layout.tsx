import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CourseSidebar from "@/components/course-sidebar";

export default async function CoursePlayerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ "course-slug": string }>;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const { "course-slug": slug } = await params;
  const supabase = await createClient();
  const anySupabase = supabase as any;

  // 1. Fetch course details
  const { data: course, error: courseError } = await anySupabase
    .from("courses")
    .select("id, title, slug")
    .eq("slug", slug)
    .single();

  if (courseError || !course) {
    redirect("/courses");
  }

  // 2. Check enrollment
  const { data: enrollment } = await anySupabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .eq("status", "active")
    .single();

  if (!enrollment) {
    // User is not enrolled. Redirect to sales page.
    redirect(`/courses/${course.slug}`);
  }

  // 3. Fetch modules and lessons
  const { data: modules } = await anySupabase
    .from("modules")
    .select("id, title, sort_order, lessons(id, title, sort_order, duration_seconds)")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  // 4. Fetch user's progress for this course
  const { data: progress } = await anySupabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id);

  // Map progress to a quick lookup map
  const progressMap = new Map();
  if (progress) {
    progress.forEach((p: any) => {
      progressMap.set(p.lesson_id, p.completed);
    });
  }

  // Inject progress and active status into lessons
  const enrichedModules = modules?.map((mod: any) => {
    // Ensure lessons are sorted
    const sortedLessons = (mod.lessons || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
    return {
      ...mod,
      lessons: sortedLessons.map((lesson: any) => ({
        ...lesson,
        completed: progressMap.get(lesson.id) || false,
      })),
    };
  }) || [];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[var(--color-surface)] overflow-hidden">
      {/* Sidebar Component */}
      <CourseSidebar course={course} modules={enrichedModules} />

      {/* Main Video Content */}
      <main className="flex-1 overflow-y-auto relative bg-black">
        {children}
      </main>
    </div>
  );
}
