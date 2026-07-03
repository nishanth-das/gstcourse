"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const anySupabase = supabase as any;
        const { data } = await anySupabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        const typedData = data as any;
        
        if (typedData) {
          setFullName(typedData.full_name || "");
          setPhone(typedData.phone || "");
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const anySupabase = supabase as any;
    const { error } = await anySupabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone,
      })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-text-dark)] mb-6">
        Profile Settings
      </h1>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-md text-sm border ${
                message.type === "success" 
                  ? "bg-green-50 border-green-100 text-green-700" 
                  : "bg-red-50 border-red-100 text-red-600"
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-dark)] mb-2">Full Name</label>
                <Input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe" 
                  className="w-full max-w-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-dark)] mb-2">Phone Number</label>
                <Input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210" 
                  className="w-full max-w-md"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Button type="submit" disabled={updating}>
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
    </div>
  );
}
