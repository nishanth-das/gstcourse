import Link from "next/link"
import Image from "next/image"
import { Container } from "./ui/container"
import { Button } from "./ui/button"
import { getCategories, getUser, getGlobalSettings } from "@/lib/supabase/queries"
import { HeaderUserMenu } from "./HeaderUserMenu"
import { HeaderNav } from "./HeaderNav"
import { MobileNav } from "./MobileNav"

export async function Header() {
  const categories = await getCategories()
  const user = await getUser()
  const settings = await getGlobalSettings()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-[var(--color-background)] shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/Logo.png" alt="GST Courses.in Logo" width={130} height={32} className="h-9 w-auto object-contain" priority />
            </Link>
            
            <HeaderNav categories={categories} menus={settings.header_menus} />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <HeaderUserMenu user={user} />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile Navigation Toggle */}
            <MobileNav categories={categories} menus={settings.header_menus} user={user} />
          </div>
        </div>
      </Container>
    </header>
  )
}
