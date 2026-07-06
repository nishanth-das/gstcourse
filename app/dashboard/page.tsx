import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const anySupabase = supabase as any;

  // 1. Fetch active enrollments
  const { data: enrollments } = await anySupabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false });

  if (!enrollments || enrollments.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-dark)] mb-6">
          My Courses
        </h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-dark)] mb-2">No Courses Yet</h2>
          <p className="text-sm text-[var(--color-charcoal)] mb-6">
            You haven't enrolled in any courses yet. Browse our catalog to get started.
          </p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Fetch all modules and lessons for these courses to compute progress
  const courseIds = enrollments.map((e: any) => e.course_id);
  const { data: modules } = await anySupabase
    .from("modules")
    .select("id, course_id, lessons(id, sort_order)")
    .in("course_id", courseIds)
    .order("sort_order", { ascending: true });

  // 3. Fetch all lesson progress for this user
  const { data: progress } = await anySupabase
    .from("lesson_progress")
    .select("lesson_id, completed, updated_at")
    .eq("user_id", user.id);

  // Group data by course
  const courseStats = new Map();

  if (modules) {
    modules.forEach((mod: any) => {
      if (!courseStats.has(mod.course_id)) {
        courseStats.set(mod.course_id, {
          totalLessons: 0,
          completedLessons: 0,
          firstLessonId: null,
          lastWatchedLessonId: null,
          lastWatchedTime: 0
        });
      }
      
      const stats = courseStats.get(mod.course_id);
      
      // Keep track of the very first lesson as a fallback
      if (mod.lessons && mod.lessons.length > 0) {
        // Find the absolute first lesson (assuming ordered by module sort_order then lesson sort_order)
        if (!stats.firstLessonId) {
          stats.firstLessonId = mod.lessons[0].id;
        }
        
        stats.totalLessons += mod.lessons.length;

        // Check progress for each lesson
        mod.lessons.forEach((lesson: any) => {
          const p = progress?.find((pr: any) => pr.lesson_id === lesson.id);
          if (p) {
            if (p.completed) stats.completedLessons++;
            
            // Find most recently watched
            const updatedTime = new Date(p.updated_at).getTime();
            if (updatedTime > stats.lastWatchedTime) {
              stats.lastWatchedTime = updatedTime;
              stats.lastWatchedLessonId = lesson.id;
            }
          }
        });
      }
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-text-dark)] mb-6">
        My Courses
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment: any) => {
          const course = enrollment.courses;
          const stats = courseStats.get(course.id) || { totalLessons: 0, completedLessons: 0 };
          
          let percent = 0;
          if (stats.totalLessons > 0) {
            percent = Math.round((stats.completedLessons / stats.totalLessons) * 100);
          }
          
          const isCompleted = percent === 100 && stats.totalLessons > 0;
          const continueLessonId = stats.lastWatchedLessonId || stats.firstLessonId;
          const targetUrl = continueLessonId 
            ? `/learn/${course.slug}/${continueLessonId}`
            : `/learn/${course.slug}`; // Fallback if no lessons exist yet

          return (
            <div key={enrollment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="aspect-video relative bg-gray-100">
                {course.thumbnail_url ? (
                  <Image 
                    src={course.thumbnail_url} 
                    alt={course.title} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Thumbnail
                  </div>
                )}
                {isCompleted && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Completed
                  </div>
                )}
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-[var(--color-text-dark)] mb-1 line-clamp-2">
                  {course.title}
                </h3>
                
                <div className="mt-auto pt-4">
                  <div className="flex justify-between text-xs text-[var(--color-charcoal)] mb-2">
                    <span>{percent}% Complete</span>
                    <span>{stats.completedLessons} / {stats.totalLessons} Lessons</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-[var(--color-primary)] h-2 rounded-full transition-all" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  
                  <Link href={targetUrl} className="block w-full">
                    <Button className="w-full" variant={isCompleted ? "outline" : "default"}>
                      {isCompleted ? "Review Course" : percent > 0 ? "Continue Learning" : "Start Course"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
