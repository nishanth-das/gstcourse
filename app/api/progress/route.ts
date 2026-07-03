import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/queries";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lesson_id, position, completed } = await req.json();

    if (!lesson_id) {
      return NextResponse.json({ error: "Missing lesson_id" }, { status: 400 });
    }

    const supabase = await createClient();
    const anySupabase = supabase as any;

    // First check if a progress row already exists
    const { data: existing } = await anySupabase
      .from("lesson_progress")
      .select("id, completed")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson_id)
      .single();

    const updatePayload: any = {
      user_id: user.id,
      lesson_id: lesson_id,
      updated_at: new Date().toISOString(),
    };

    if (position !== undefined) {
      updatePayload.last_watched_position = Math.floor(position);
    }
    
    // Once completed, don't un-complete it via position updates
    if (completed !== undefined) {
      updatePayload.completed = existing?.completed ? true : completed;
    }

    if (existing) {
      // Update
      const { error } = await anySupabase
        .from("lesson_progress")
        .update(updatePayload)
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      // Insert
      const { error } = await anySupabase
        .from("lesson_progress")
        .insert(updatePayload);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Progress API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
