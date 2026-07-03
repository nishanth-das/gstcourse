import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Refund Policy | GST Courses.in",
  description: "Refund Policy for GST Courses.in",
};

export default function RefundPolicyPage() {
  return (
    <div className="py-12 md:py-20 bg-white min-h-[60vh]">
      <Container className="max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-dark)] mb-8">
          Refund Policy
        </h1>
        
        <div className="prose prose-lg max-w-none text-[var(--color-charcoal)]">
          <p className="font-medium">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Digital Products Nature</h2>
          <p>
            GST Courses.in provides digital educational courses, videos, and study materials. Due to the immediate access granted to these digital assets upon purchase, our refund policy is strictly governed by the conditions outlined below.
          </p>

          <h2>2. 7-Day Refund Guarantee</h2>
          <p>
            We are confident in the quality of our courses. However, if you are not completely satisfied with your learning experience, you may request a refund within exactly <strong>7 days</strong> from the date and time of your original purchase.
          </p>
          <p>
            <strong>Eligibility Criteria for a Refund:</strong>
          </p>
          <ul>
            <li>The refund request must be initiated within 7 days of the purchase.</li>
            <li>You must have completed/viewed <strong>less than 20%</strong> of the total course curriculum. We track lesson completion on our backend to verify this.</li>
            <li>You must provide a constructive reason for requesting the refund so that we can improve our offerings.</li>
          </ul>

          <h2>3. Exceptions (Non-Refundable Cases)</h2>
          <p>
            We reserve the right, at our sole discretion, to limit or deny refund requests in cases where we believe there is refund abuse, including but not limited to the following:
          </p>
          <ul>
            <li>If more than 20% of the course has been consumed or downloaded.</li>
            <li>If the 7-day period has elapsed since the purchase date.</li>
            <li>If a user has requested multiple refunds for different courses in the past.</li>
            <li>If a user has violated our Terms of Service (e.g., account sharing).</li>
          </ul>

          <h2>4. How to Request a Refund</h2>
          <p>
            To initiate a refund, please send an email to our support team (found on our Contact page) from your registered email address. Include:
          </p>
          <ul>
            <li>Your Full Name</li>
            <li>Registered Email Address</li>
            <li>Order ID (found in your dashboard or email receipt)</li>
            <li>Reason for the refund</li>
          </ul>

          <h2>5. Refund Processing Time</h2>
          <p>
            Once your refund request is received and inspected, we will notify you via email of the approval or rejection of your refund. 
          </p>
          <p>
            If your request is approved, we will initiate the refund from our end. The amount will be credited back to your original method of payment (via our payment gateway partner, Razorpay) within <strong>5 to 7 business days</strong>, depending on your bank or credit card issuer.
          </p>

          <h2>6. Late or Missing Refunds</h2>
          <p>
            If you haven't received an approved refund after 7 business days, please first check your bank account again. Then contact your credit card company or bank, as it may take some time before your refund is officially posted. If you've done all of this and you still have not received your refund, please contact us.
          </p>
        </div>
      </Container>
    </div>
  );
}
