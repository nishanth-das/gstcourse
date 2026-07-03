import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Privacy Policy | GST Courses.in",
  description: "Privacy Policy for GST Courses.in",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 md:py-20 bg-white min-h-[60vh]">
      <Container className="max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-dark)] mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg max-w-none text-[var(--color-charcoal)]">
          <p className="font-medium">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to GST Courses.in ("we", "our", or "us"). We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (gstcourse.in) or purchase our courses. Please read this Privacy Policy carefully. By using the site, you consent to the data practices described in this policy.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We may collect personal identification information from you in a variety of ways, including, but not limited to, when you visit our site, register on the site, place an order, subscribe to the newsletter, and in connection with other activities, services, features, or resources we make available on our site.
          </p>
          <ul>
            <li><strong>Personal Data:</strong> Name, email address, phone number, billing address.</li>
            <li><strong>Financial Data:</strong> We do not store your credit card or UPI details on our servers. All payments are processed securely through our third-party payment processor, Razorpay.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, courses viewed, and learning progress.</li>
            <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types, and operating system.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We may use the information we collect from you in the following ways:</p>
          <ul>
            <li>To process your transactions and deliver the courses you have purchased.</li>
            <li>To manage your account and provide customer support.</li>
            <li>To personalize your user experience and deliver content relevant to your interests.</li>
            <li>To send periodic emails regarding your order or other products and services.</li>
            <li>To improve our website and the courses we offer based on your feedback.</li>
            <li>To comply with legal and regulatory obligations under Indian law.</li>
          </ul>

          <h2>4. Data Protection & Security</h2>
          <p>
            We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site. Sensitive and private data exchange between the Site and its Users happens over a SSL secured communication channel and is encrypted and protected with digital signatures.
          </p>

          <h2>5. Sharing Your Personal Information</h2>
          <p>
            We do not sell, trade, or rent Users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers. We may use third-party service providers to help us operate our business and the Site or administer activities on our behalf (e.g., Razorpay for payments, Supabase for authentication/database).
          </p>

          <h2>6. Cookies and Tracking Technologies</h2>
          <p>
            Our Site may use "cookies" to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. You may choose to set your web browser to refuse cookies, or to alert you when cookies are being sent. If you do so, note that some parts of the Site may not function properly.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            Depending on your location, you may have the right to access, correct, update, or delete your personal data. You can manage your account information directly from your dashboard or contact us for assistance.
          </p>

          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            GST Courses.in has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the top of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us via our Contact page or at our official support email.
          </p>
        </div>
      </Container>
    </div>
  );
}
