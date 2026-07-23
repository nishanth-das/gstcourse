"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/queries";
import { revalidatePath } from "next/cache";

// Ensure caller is an admin
async function ensureAdmin() {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function getCoupons() {
  await ensureAdmin();
  const supabase = createAdminClient() as any;
  
  const { data, error } = await supabase
    .from("coupons")
    .select("*");
    
  if (error) throw new Error(error.message);
  return data;
}

export async function saveCoupon(payload: any, editingId?: string) {
  await ensureAdmin();
  const supabase = createAdminClient() as any;
  
  if (editingId) {
    const { error } = await supabase
      .from("coupons")
      .update(payload)
      .eq("id", editingId);
      
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("coupons")
      .insert(payload);
      
    if (error) throw new Error(error.message);
  }
  
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  await ensureAdmin();
  const supabase = createAdminClient() as any;
  
  const { error } = await supabase
    .from("coupons")
    .delete()
    .eq("id", id);
    
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}
