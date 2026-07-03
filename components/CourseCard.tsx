import Link from "next/link";
import { Course, Category } from "@/lib/supabase/queries";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

export function CourseCard({ course, category }: { course: Course, category?: Category }) {
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: course.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(course.price);

  const formattedComparePrice = course.compare_at_price && course.compare_at_price > course.price 
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: course.currency || 'INR',
        maximumFractionDigits: 0,
      }).format(course.compare_at_price)
    : null;

  return (
    <Link href={`/courses/${category?.slug || 'all'}/${course.slug}`} className="block h-full group">
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 overflow-hidden group/card">
        <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
          {course.thumbnail_url ? (
            <img 
              src={course.thumbnail_url} 
              alt={course.title} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover/card:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
              <span className="text-sm">No Thumbnail</span>
            </div>
          )}
        </div>
        
        <CardHeader className="flex-none pb-2">
          <div className="flex items-center justify-between mb-2">
            {category && (
              <Badge variant="secondary" className="text-[10px] uppercase">
                {category.name}
              </Badge>
            )}
            {course.level && (
              <span className="text-xs text-[var(--color-charcoal)]">{course.level}</span>
            )}
          </div>
          <CardTitle className="text-lg group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
            {course.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <CardDescription className="line-clamp-3">
            {course.short_description}
          </CardDescription>
        </CardContent>
        
        <CardFooter className="flex-none pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            {formattedComparePrice && (
              <span className="text-xs text-gray-400 line-through">
                {formattedComparePrice}
              </span>
            )}
            <span className="text-lg font-bold text-[var(--color-text-dark)] leading-tight">
              {formattedPrice}
            </span>
          </div>
          <span className="text-sm font-medium text-[var(--color-primary)]">
            View Course →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
