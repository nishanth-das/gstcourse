import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CoursePlayerRedirectPage({
  params,
}: {
  params: Promise<{ "course-slug": string }>;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const { "course-slug": slug } = await params;
  const supabase = await createClient();
  const anySupabase = supabase as any;

  // 1. Fetch course ID
  const { data: course, error: courseError } = await anySupabase
    .from("courses")
    .select("id, slug")
    .eq("slug", slug)
    .single();

  if (courseError || !course) {
    redirect("/dashboard");
  }

  // 2. Fetch all modules and lessons
  const { data: modules } = await anySupabase
    .from("modules")
    .select("id, lessons(id, sort_order)")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  if (!modules || modules.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        <h2>This course has no lessons yet.</h2>
      </div>
    );
  }

  // Get all lesson IDs in order
  const orderedLessonIds: string[] = [];
  modules.forEach((mod: any) => {
    const sorted = (mod.lessons || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
    sorted.forEach((l: any) => orderedLessonIds.push(l.id));
  });

  if (orderedLessonIds.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        <h2>This course has no lessons yet.</h2>
      </div>
    );
  }

  // 3. Check progress to find last watched
  const { data: progress } = await anySupabase
    .from("lesson_progress")
    .select("lesson_id, updated_at")
    .eq("user_id", user.id)
    .in("lesson_id", orderedLessonIds)
    .order("updated_at", { ascending: false })
    .limit(1);

  let targetLessonId = orderedLessonIds[0]; // Fallback to first lesson

  if (progress && progress.length > 0) {
    targetLessonId = progress[0].lesson_id;
  }

  redirect(`/learn/${course.slug}/${targetLessonId}`);
}
