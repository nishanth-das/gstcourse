import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StudentProfileClient from "./student-profile-client";

export default async function StudentProfilePage({
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
  // Fetch the student profile
  const { data: student } = await anySupabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!student) {
    redirect("/admin/students");
  }

  // Fetch all courses (for the "Grant Access" dropdown)
  const { data: courses } = await anySupabase
    .from("courses")
    .select("id, title")
    .order("title", { ascending: true });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          User Profile: {student.full_name || 'Anonymous'}
        </h1>
        <p className="text-gray-500 mt-1">
          Manage enrollments, orders, and role for this user.
        </p>
      </div>

      <StudentProfileClient student={student} courses={courses || []} />
    </div>
  );
}
