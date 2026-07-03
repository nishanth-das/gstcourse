import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gstcourse.in';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "GST Courses.in - Master GST Return Filing in India",
    template: "%s | GST Courses.in",
  },
  description: "The most comprehensive, practical, and up-to-date GST course designed for accountants, business owners, and tax professionals in India.",
  openGraph: {
    title: "GST Courses.in",
    description: "The most comprehensive, practical, and up-to-date GST course designed for accountants, business owners, and tax professionals in India.",
    url: baseUrl,
    siteName: "GST Courses.in",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "GST Courses.in",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GST Courses.in",
    description: "Learn GST the practical way with our comprehensive courses.",
    images: [`${baseUrl}/og-image.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GST Courses.in',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`, // Update this if a logo exists
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
