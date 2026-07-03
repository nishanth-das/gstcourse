import { getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-500 mt-1">Manage global website copy, contact information, and trust badges.</p>
      </div>

      <SettingsClient />
    </div>
  );
}
