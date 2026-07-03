"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/queries";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: string) {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();
  const anySupabase = supabase as any;

  // Try to delete the course.
  // If there are foreign key constraints (like enrollments), it will fail with an error.
  const { error } = await anySupabase
    .from("courses")
    .delete()
    .eq("id", courseId);

  if (error) {
    if (error.code === "23503") { // foreign_key_violation
      return { 
        error: "Cannot delete this course because students are enrolled or there are associated records. Please change the status to 'Draft' instead." 
      };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/courses");
  return { success: true };
}
