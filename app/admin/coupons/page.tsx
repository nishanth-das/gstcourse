import { getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import CouponsClient from "./coupons-client";

export default async function CouponsPage() {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
        <p className="text-gray-500 mt-1">Create and manage discount codes for your courses.</p>
      </div>

      <CouponsClient />
    </div>
  );
}
