import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 py-12">
      <Container className="max-w-md text-center">
        <div className="w-20 h-20 bg-[var(--color-surface)] text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-[var(--color-text-dark)] mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link href="/courses">
          <Button size="lg" className="w-full sm:w-auto px-8">
            Browse All Courses
          </Button>
        </Link>
      </Container>
    </div>
  );
}
