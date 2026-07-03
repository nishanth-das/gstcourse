import Link from "next/link"
import Image from "next/image"
import { Container } from "./ui/container"
import { getCategories } from "@/lib/supabase/queries"

export async function Footer() {
  const categories = await getCategories()

  return (
    <footer className="border-t border-gray-200 bg-[var(--color-surface)] py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image src="/Logo.png" alt="GST Courses.in Logo" width={120} height={30} className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-sm text-[var(--color-charcoal)]">
              Learn GST the practical way. Quality education for accountants and tax professionals.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[var(--color-text-dark)] mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-[var(--color-charcoal)]">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/courses/${cat.slug}`} className="hover:text-[var(--color-primary)]">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li><Link href="/courses" className="hover:text-[var(--color-primary)] font-medium">All Courses</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--color-text-dark)] mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-[var(--color-charcoal)]">
              <li><Link href="/about" className="hover:text-[var(--color-primary)]">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--color-primary)]">Contact</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-[var(--color-primary)]">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[var(--color-primary)]">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[var(--color-primary)]">Refund Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-[var(--color-text-dark)] mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-[var(--color-charcoal)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                f
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-[var(--color-charcoal)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                y
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-300 text-center text-sm text-[var(--color-charcoal)]">
          © {new Date().getFullYear()} GST Courses.in. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
