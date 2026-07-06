"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function CourseSidebar({ course, modules }: { course: any; modules: any[] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Calculate overall progress
  let totalLessons = 0;
  let completedLessons = 0;

  modules.forEach(m => {
    totalLessons += m.lessons.length;
    completedLessons += m.lessons.filter((l: any) => l.completed).length;
  });

  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed bottom-4 right-4 z-[60] bg-[var(--color-primary)] text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 w-80 flex-shrink-0 flex flex-col h-full transition-transform duration-300 z-50 fixed md:relative inset-y-0 left-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-[var(--color-text-dark)] mb-2 line-clamp-2">
            {course.title}
          </h2>
          <div className="flex justify-between text-xs text-[var(--color-charcoal)] mb-2">
            <span>{percent}% Complete</span>
            <span>{completedLessons}/{totalLessons}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all" 
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {modules.map((mod, index) => (
            <div key={mod.id}>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 text-xs flex items-center justify-center mr-2">
                  {index + 1}
                </span>
                {mod.title}
              </h3>
              
              <ul className="space-y-1">
                {mod.lessons.map((lesson: any, lIndex: number) => {
                  const lessonUrl = `/learn/${course.slug}/${lesson.id}`;
                  const isActive = pathname === lessonUrl;
                  
                  return (
                    <li key={lesson.id}>
                      <Link 
                        href={lessonUrl}
                        className={`flex items-start p-2 rounded-md text-sm transition-colors ${
                          isActive 
                            ? "bg-blue-50 text-[var(--color-primary)] font-medium" 
                            : "hover:bg-gray-50 text-[var(--color-charcoal)]"
                        }`}
                      >
                        <div className="mt-0.5 mr-3 flex-shrink-0">
                          {lesson.completed ? (
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : isActive ? (
                            <div className="w-4 h-4 rounded-full border-2 border-[var(--color-primary)] bg-white flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></div>
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                          )}
                        </div>
                        <span className="flex-1">{lesson.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
