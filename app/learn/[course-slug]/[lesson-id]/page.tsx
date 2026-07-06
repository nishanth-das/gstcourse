import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VideoPlayer from "./video-player";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ "course-slug": string; "lesson-id": string }>;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const { "course-slug": slug, "lesson-id": lessonId } = await params;
  const supabase = await createClient();
  const anySupabase = supabase as any;

  // 1. Fetch course
  const { data: course } = await anySupabase
    .from("courses")
    .select("id, title, slug")
    .eq("slug", slug)
    .single();

  if (!course) redirect("/dashboard");

  // 2. Fetch all modules/lessons to determine prev/next
  const { data: modules } = await anySupabase
    .from("modules")
    .select("id, lessons(id, title, sort_order, youtube_video_id, is_preview, material_url, material_title)")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  if (!modules) redirect(`/learn/${course.slug}`);

  // Flatten lessons in order
  const orderedLessons: any[] = [];
  modules.forEach((mod: any) => {
    const sorted = (mod.lessons || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
    sorted.forEach((l: any) => orderedLessons.push(l));
  });

  const currentIndex = orderedLessons.findIndex(l => l.id === lessonId);
  if (currentIndex === -1) {
    redirect(`/learn/${course.slug}`);
  }

  const currentLesson = orderedLessons[currentIndex];
  const prevLesson = currentIndex > 0 ? orderedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < orderedLessons.length - 1 ? orderedLessons[currentIndex + 1] : null;

  // 3. Fetch user's progress for THIS lesson to get starting position
  const { data: progress } = await anySupabase
    .from("lesson_progress")
    .select("last_watched_position, completed")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .single();

  const startPos = progress?.last_watched_position || 0;

  // 4. Generate signed URL for study material if it exists and is stored in our private bucket
  let materialDownloadUrl = currentLesson?.material_url;
  if (materialDownloadUrl && materialDownloadUrl.includes("/lesson-materials/")) {
    const filePath = materialDownloadUrl.split("/lesson-materials/")[1];
    const { data } = await anySupabase.storage.from("lesson-materials").createSignedUrl(filePath, 60 * 60); // 1 hour expiry
    if (data?.signedUrl) {
      materialDownloadUrl = data.signedUrl;
    }
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Video Player Area */}
      <div className="flex-1 min-h-[50vh] relative bg-black">
        <VideoPlayer 
          videoId={currentLesson.youtube_video_id} 
          lessonId={lessonId}
          startPosition={startPos}
          nextLessonUrl={nextLesson ? `/learn/${course.slug}/${nextLesson.id}` : null}
        />
      </div>

      {/* Lesson Details & Navigation */}
      <div className="bg-[var(--color-surface)] text-[var(--color-text-dark)] p-6 md:p-8 flex-shrink-0 border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{currentLesson.title}</h1>
            <p className="text-[var(--color-charcoal)] mb-4 md:mb-0">
              Course: <span className="font-medium text-[var(--color-primary)]">{course.title}</span>
            </p>
            {materialDownloadUrl && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg inline-block">
                <p className="text-sm font-bold text-blue-900 mb-2">Study Material</p>
                <a 
                  href={materialDownloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm bg-white border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm font-medium"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  {currentLesson.material_title || "Download Material"}
                </a>
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            {prevLesson ? (
              <Link href={`/dashboard/courses/${course.slug}/${prevLesson.id}`}>
                <Button variant="outline">Previous Lesson</Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>Previous Lesson</Button>
            )}
            
            {nextLesson ? (
              <Link href={`/dashboard/courses/${course.slug}/${nextLesson.id}`}>
                <Button>Next Lesson</Button>
              </Link>
            ) : (
              <Button disabled>Next Lesson</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
