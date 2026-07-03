"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface HeaderUserMenuProps {
  user: User & {
    profile?: {
      full_name?: string | null;
      avatar_url?: string | null;
      role?: string;
    } | null;
  };
}

export function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const displayName = user.profile?.full_name || user.email?.split('@')[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-gray-200 p-1 pr-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      >
        <div className="w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
          {user.profile?.avatar_url ? (
            <img src={user.profile.avatar_url} alt={displayName} className="w-full h-full rounded-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <span className="text-sm font-medium text-[var(--color-text-dark)] hidden sm:block">
          {displayName}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            
            <Link 
              href="/dashboard" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--color-primary)]"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            
            <Link 
              href="/dashboard/profile" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--color-primary)]"
              onClick={() => setIsOpen(false)}
            >
              Profile Settings
            </Link>
            
            {user.profile?.role === "admin" && (
              <Link 
                href="/admin" 
                className="block px-4 py-2 text-sm font-bold text-[var(--color-primary)] hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            
            <div className="border-t border-gray-100"></div>
            
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Log Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
