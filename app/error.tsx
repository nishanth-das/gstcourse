'use client';

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 py-12">
      <Container className="max-w-md text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--color-text-dark)] mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-8">
          We encountered an unexpected error while loading this page. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => reset()} size="lg">
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              Go back home
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
