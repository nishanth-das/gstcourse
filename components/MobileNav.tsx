"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

type MenuType = {
  id: string;
  label: string;
  url: string;
  type: "link" | "category_dropdown";
};

export function MobileNav({ categories, menus, user }: { categories: any[], menus?: MenuType[], user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fallback if settings haven't been saved yet
  const safeMenus = menus || [
    { id: "1", label: "Home", url: "/", type: "link" },
    { id: "2", label: "Courses", url: "/courses", type: "category_dropdown" },
    { id: "3", label: "About", url: "/about", type: "link" },
    { id: "4", label: "Contact", url: "/contact", type: "link" }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when route changes
  const handleLinkClick = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button 
        onClick={toggleMenu} 
        className="p-2 text-gray-600 hover:text-[var(--color-primary)] transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 px-4 py-6 flex flex-col gap-4">
          <nav className="flex flex-col gap-4">
            {safeMenus.map((menu) => {
              if (menu.type === "category_dropdown") {
                return (
                  <div key={menu.id} className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{menu.label}</span>
                    <div className="flex flex-col pl-2 gap-3 border-l-2 border-gray-100">
                      {categories.map((category) => (
                        <div key={category.id} className="flex flex-col gap-2">
                          <Link 
                            href={`/courses/${category.slug}`} 
                            onClick={handleLinkClick}
                            className="text-[13px] font-black text-gray-800 uppercase tracking-wide"
                          >
                            {category.name}
                          </Link>
                          {category.children?.map((child: any) => (
                            <Link 
                              key={child.id} 
                              href={`/courses/${child.slug}`}
                              onClick={handleLinkClick}
                              className={`text-sm pl-2 ${
                                pathname === `/courses/${child.slug}` 
                                  ? "text-[var(--color-primary)] font-bold" 
                                  : "text-gray-600 font-medium hover:text-[var(--color-primary)]"
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                      <Link 
                        href={menu.url} 
                        onClick={handleLinkClick}
                        className="text-sm font-bold text-[var(--color-primary)] mt-1"
                      >
                        View All {menu.label}
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <Link 
                  key={menu.id}
                  href={menu.url} 
                  onClick={handleLinkClick}
                  className={`text-lg font-bold border-b border-gray-50 pb-2 ${
                    pathname === menu.url ? "text-[var(--color-primary)]" : "text-gray-800 hover:text-[var(--color-primary)]"
                  }`}
                >
                  {menu.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
            {user ? (
              <Link href="/dashboard" onClick={handleLinkClick}>
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={handleLinkClick}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/signup" onClick={handleLinkClick}>
                  <Button className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
