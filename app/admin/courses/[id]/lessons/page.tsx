import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LessonsClient from "./lessons-client";

export default async function CourseLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }

  const { id } = await params;
  const supabase = await createClient();
  const anySupabase = supabase as any;
  // Fetch course
  const { data: course } = await anySupabase
    .from("courses")
    .select("id, title")
    .eq("id", id)
    .single();

  if (!course) {
    redirect("/admin/courses");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Manage Curriculum: {course.title}
        </h1>
        <p className="text-gray-500 mt-1">
          Organize your course into modules and lessons.
        </p>
      </div>

      <LessonsClient courseId={id} />
    </div>
  );
}
