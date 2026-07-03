import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CourseEditClient from "./course-edit-client";

export default async function CourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }

  const { id } = await params;
  const isNew = id === "new";

  const supabase = await createClient();
  const anySupabase = supabase as any;
  // Fetch categories
  const { data: categories } = await anySupabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  let course = null;
  if (!isNew) {
    const { data } = await anySupabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();
    
    if (!data) {
      redirect("/admin/courses");
    }
    course = data;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isNew ? "Create New Course" : `Edit Course: ${course.title}`}
        </h1>
        <p className="text-gray-500 mt-1">
          {isNew ? "Fill out the details below to create a new course." : "Update the details and content of this course."}
        </p>
      </div>

      <CourseEditClient initialCourse={course} categories={categories || []} />
    </div>
  );
}
