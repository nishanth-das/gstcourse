"use client";

import { useState } from "react";
import { Container } from "./ui/container";
import { CourseCard } from "./CourseCard";
import { Course, CategoryWithChildren } from "@/lib/supabase/queries";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CourseCatalogProps {
  initialCourses: Course[];
  categories: CategoryWithChildren[];
  title: string;
  description?: string;
}

export function CourseCatalog({ initialCourses, categories, title, description }: CourseCatalogProps) {
  const [sort, setSort] = useState("newest");
  const pathname = usePathname();

  // Simple client-side sorting
  const sortedCourses = [...initialCourses].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    // newest (default)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="py-12 bg-[var(--color-surface)] min-h-screen">
      <Container>
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-dark)]">{title}</h1>
          {description && <p className="mt-2 text-[var(--color-charcoal)]">{description}</p>}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filter */}
          <div className="w-full md:w-64 flex-none space-y-6">
            <div>
              <h3 className="font-semibold text-[var(--color-text-dark)] mb-3 border-b border-gray-200 pb-2">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/courses" 
                    className={`block text-sm py-1 ${pathname === '/courses' ? 'font-bold text-[var(--color-primary)]' : 'text-[var(--color-charcoal)] hover:text-[var(--color-primary)]'}`}
                  >
                    All Courses
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link 
                      href={`/courses/${cat.slug}`} 
                      className={`block text-sm py-1 font-medium ${pathname === `/courses/${cat.slug}` ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-dark)] hover:text-[var(--color-primary)]'}`}
                    >
                      {cat.name}
                    </Link>
                    {cat.children && cat.children.length > 0 && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {cat.children.map(child => (
                          <li key={child.id}>
                            <Link 
                              href={`/courses/${child.slug}`} 
                              className={`block text-sm py-1 ${pathname === `/courses/${child.slug}` ? 'font-bold text-[var(--color-primary)]' : 'text-[var(--color-charcoal)] hover:text-[var(--color-primary)]'}`}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-[var(--color-charcoal)]">
                Showing {sortedCourses.length} course{sortedCourses.length !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-[var(--color-charcoal)]">Sort by:</label>
                <select 
                  id="sort"
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md py-1 px-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {sortedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses.map(course => {
                  let courseCat;
                  categories.forEach(parent => {
                    if (parent.id === course.category_id) courseCat = parent;
                    parent.children?.forEach(child => {
                      if (child.id === course.category_id) courseCat = child;
                    });
                  });
                  return <CourseCard key={course.id} course={course} category={courseCat} />;
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <h3 className="text-lg font-medium text-[var(--color-text-dark)] mb-2">No courses found</h3>
                <p className="text-[var(--color-charcoal)]">There are currently no published courses in this category.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
