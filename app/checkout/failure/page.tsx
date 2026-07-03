import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-surface)] py-12 flex items-center justify-center px-4">
      <Container className="max-w-md text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-dark)] mb-2">Payment Failed</h1>
          <p className="text-[var(--color-charcoal)] mb-8">
            Unfortunately, your payment could not be processed. Your account has not been charged.
          </p>
          <Link href="/courses">
            <Button className="w-full" variant="outline">Try Again</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
