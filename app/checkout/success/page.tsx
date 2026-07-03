import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-surface)] py-12 flex items-center justify-center px-4">
      <Container className="max-w-md text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-dark)] mb-2">Payment Successful!</h1>
          <p className="text-[var(--color-charcoal)] mb-8">
            Thank you for your purchase. Your enrollment is now active and a receipt has been sent to your email.
          </p>
          <Link href="/dashboard">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
