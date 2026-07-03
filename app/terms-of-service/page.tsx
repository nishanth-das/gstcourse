import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Terms of Service | GST Courses.in",
  description: "Terms of Service for GST Courses.in",
};

export default function TermsOfServicePage() {
  return (
    <div className="py-12 md:py-20 bg-white min-h-[60vh]">
      <Container className="max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-dark)] mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-lg max-w-none text-[var(--color-charcoal)]">
          <p className="font-medium">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Terms</h2>
          <p>
            By accessing the website at GST Courses.in (the "Site") and purchasing any of our courses, you are agreeing to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws, specifically including those of the Republic of India. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2>2. Use License & Intellectual Property</h2>
          <p>
            All content, videos, materials, and resources provided on GST Courses.in are the intellectual property of GST Courses.in. Permission is granted to temporarily view the materials (information or software) on GST Courses.in's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify, copy, or download (unless explicitly permitted) the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>share your login credentials with others to provide unauthorized access to our paid courses;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p>
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by GST Courses.in at any time without refund.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the Site, including purchasing and viewing courses, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
          </p>

          <h2>4. Payments & Pricing</h2>
          <p>
            All prices listed on the Site are in Indian Rupees (INR) unless otherwise stated. We reserve the right to modify prices at any time. Payments are processed securely via our payment gateway partner, Razorpay. By providing your payment information, you represent and warrant that you have the legal right to use the payment method provided.
          </p>

          <h2>5. Disclaimer</h2>
          <p>
            The materials on GST Courses.in's website are provided on an 'as is' basis. GST Courses.in makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. 
          </p>
          <p>
            <strong>Note on Tax Advice:</strong> The courses provided are for educational purposes only. They do not constitute professional tax, legal, or financial advice. Users should consult with a qualified Chartered Accountant or tax professional for specific tax guidance related to their business.
          </p>

          <h2>6. Limitations of Liability</h2>
          <p>
            In no event shall GST Courses.in or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on GST Courses.in's website, even if GST Courses.in or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>

          <h2>7. Governing Law & Jurisdiction</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any dispute arising out of or related to these Terms or your use of the Site will be subject to the exclusive jurisdiction of the courts located in India.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            GST Courses.in reserves the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Site after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us via our Contact page.
          </p>
        </div>
      </Container>
    </div>
  );
}
