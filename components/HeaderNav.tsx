"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Menu = {
  id: string;
  label: string;
  url: string;
  type: "link" | "category_dropdown";
};

export function HeaderNav({ categories, menus }: { categories: any[], menus?: Menu[] }) {
  const pathname = usePathname();

  // Fallback if settings haven't been saved yet
  const safeMenus = menus || [
    { id: "1", label: "Home", url: "/", type: "link" },
    { id: "2", label: "Courses", url: "/courses", type: "category_dropdown" },
    { id: "3", label: "About", url: "/about", type: "link" },
    { id: "4", label: "Contact", url: "/contact", type: "link" }
  ];

  return (
    <nav className="hidden md:flex items-center gap-8">
      {safeMenus.map((menu) => {
        if (menu.type === "category_dropdown") {
          return (
            <div key={menu.id} className="relative group cursor-pointer py-2">
              <span className={`text-[15px] font-bold transition-colors flex items-center gap-1 ${
                pathname.startsWith(menu.url) ? "text-[var(--color-primary)]" : "text-gray-700 group-hover:text-[var(--color-primary)]"
              }`}>
                {menu.label} <span className="text-[10px]">▼</span>
              </span>
              <div className="absolute top-full left-0 mt-0 hidden w-56 flex-col rounded-xl border border-gray-100 bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] group-hover:flex transition-all">
                {categories.map((category) => (
                  <div key={category.id} className="mb-2 last:mb-0">
                    <Link href={`/courses/${category.slug}`} className="block px-3 py-1.5 text-[11px] font-black text-gray-400 hover:text-[var(--color-primary)] uppercase tracking-widest">
                      {category.name}
                    </Link>
                    {category.children?.map((child: any) => (
                      <Link 
                        key={child.id} 
                        href={`/courses/${child.slug}`}
                        className={`block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                          pathname === `/courses/${child.slug}` 
                            ? "bg-orange-50 text-[var(--color-primary)]" 
                            : "text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ))}
                <div className="border-t border-gray-100 my-2"></div>
                <Link href={menu.url} className="block rounded-lg px-3 py-2.5 text-sm font-bold text-[var(--color-primary)] hover:bg-orange-50 text-center transition-colors">
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
            className={`text-[15px] font-bold transition-colors ${
              pathname === menu.url ? "text-[var(--color-primary)]" : "text-gray-700 hover:text-[var(--color-primary)]"
            }`}
          >
            {menu.label}
          </Link>
        );
      })}
    </nav>
  );
}
