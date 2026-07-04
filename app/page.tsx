import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import { getPublishedCourses, getCategories, getGlobalSettings } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, Award, Shield, Users, CheckCircle, Star } from "lucide-react";
import { HeroSlider } from "@/components/HeroSlider";

import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  return {
    title: settings.hero_headline || "GST Courses.in",
    description: settings.hero_subheadline || "The most comprehensive, practical, and up-to-date GST course designed for accountants, business owners, and tax professionals in India.",
  };
}

export default async function Home() {
  const [courses, categories, settings] = await Promise.all([
    getPublishedCourses(),
    getCategories(),
    getGlobalSettings()
  ]);

  const featuredCourses = courses.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <HeroSlider headline={settings.hero_headline} subheadline={settings.hero_subheadline} />

      {/* Trust Strip */}
      <section className="bg-white py-12 relative -mt-8 z-20">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="space-y-2">
              <h4 className="text-3xl font-black text-[var(--color-primary)] drop-shadow-sm">{settings.stats_students}</h4>
              <p className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wider">Active Students</p>
            </div>
            <div className="space-y-2 border-l border-gray-100">
              <h4 className="text-3xl font-black text-[var(--color-primary)] drop-shadow-sm">{courses.length}+</h4>
              <p className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wider">Expert Courses</p>
            </div>
            <div className="space-y-2 border-l border-gray-100 hidden md:block">
              <h4 className="text-3xl font-black text-[var(--color-primary)] drop-shadow-sm">100%</h4>
              <p className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wider">Practical Focus</p>
            </div>
            <div className="space-y-2 border-l border-gray-100 hidden md:block">
              <h4 className="text-3xl font-black text-[var(--color-primary)] drop-shadow-sm">Lifetime</h4>
              <p className="text-sm font-semibold text-[var(--color-charcoal)] uppercase tracking-wider">Access Options</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Curriculum Highlights / What You Will Learn */}
      <section className="py-24 bg-gradient-to-b from-[var(--color-surface)] to-white">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <Badge variant="outline" className="border-orange-200 text-orange-600 bg-orange-50">Curriculum Highlights</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text-dark)]">
                Everything you need to master GST returns
              </h2>
              <p className="text-lg text-[var(--color-charcoal)]">
                Our courses are designed to take you from basic concepts to advanced practical return filing using real-world case studies and official GST portal simulations.
              </p>
              
              <ul className="space-y-4 mt-6">
                {[
                  "Complete GST Registration & Amendment processes",
                  "Filing GSTR-1, GSTR-3B, and Annual Returns (GSTR-9)",
                  "Input Tax Credit (ITC) reconciliation with GSTR-2A/2B",
                  "E-way Bill generation and E-invoicing rules",
                  "Handling GST Notices and Departmental Queries"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <CheckCircle className="w-6 h-6 text-[var(--color-primary)] mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[var(--color-text-dark)] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-4">
                <Link href="/courses/gst/complete-practical-gst-course">
                  <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white group">
                    Explore Full Curriculum
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-orange-50 rounded-3xl transform rotate-3 scale-105 opacity-50 z-0"></div>
              <div className="bg-white p-8 rounded-3xl shadow-xl relative z-10 border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-6 rounded-2xl text-center group hover:bg-orange-50 transition-colors">
                      <h4 className="text-3xl font-black text-[var(--color-primary)] mb-1">40+</h4>
                      <p className="text-sm font-semibold text-gray-500 group-hover:text-orange-700">Hours of Video</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl text-center group hover:bg-orange-50 transition-colors">
                      <h4 className="text-3xl font-black text-[var(--color-primary)] mb-1">15+</h4>
                      <p className="text-sm font-semibold text-gray-500 group-hover:text-orange-700">Case Studies</p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="bg-gray-50 p-6 rounded-2xl text-center group hover:bg-orange-50 transition-colors">
                      <h4 className="text-3xl font-black text-[var(--color-primary)] mb-1">PDF</h4>
                      <p className="text-sm font-semibold text-gray-500 group-hover:text-orange-700">Study Materials</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl text-center group hover:bg-orange-50 transition-colors">
                      <h4 className="text-3xl font-black text-[var(--color-primary)] mb-1">24/7</h4>
                      <p className="text-sm font-semibold text-gray-500 group-hover:text-orange-700">Doubt Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <Container>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-dark)] mb-2">Featured Courses</h2>
              <p className="text-[var(--color-charcoal)]">Our most popular training programs</p>
            </div>
            <Link href="/courses" className="hidden sm:block text-[var(--color-primary)] font-medium hover:underline">
              View all →
            </Link>
          </div>
          
          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course: any) => {
                // Find course category for the card
                let courseCat;
                categories.forEach((parent: any) => {
                  if (parent.id === course.category_id) courseCat = parent;
                  parent.children?.forEach((child: any) => {
                    if (child.id === course.category_id) courseCat = child;
                  });
                });
                return <CourseCard key={course.id} course={course} category={courseCat} />;
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No courses available at the moment.
            </div>
          )}
          
          <div className="mt-10 sm:hidden text-center">
            <Link href="/courses">
              <Button variant="outline" className="w-full">View all courses</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Browse by Category */}
      <section className="py-24 bg-gradient-to-b from-white to-[var(--color-surface)]">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-dark)] mb-2">Browse by Subject</h2>
            <p className="text-[var(--color-charcoal)]">Find exactly what you want to learn</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {categories.map((category: any) => (
              <Link key={category.id} href={`/courses/${category.slug}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-xl font-bold text-[var(--color-text-dark)] group-hover:text-[var(--color-primary)] transition-colors mb-2 relative z-10">
                    {category.name}
                  </h3>
                  <p className="text-[var(--color-charcoal)] text-sm relative z-10">
                    {category.children?.length || 0} sub-categories available
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Learn With Us */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-dark)] mb-2">Why Learn With Us?</h2>
            <p className="text-[var(--color-charcoal)]">The GSTCourses.in advantage</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <BookOpen className="w-10 h-10 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-dark)] mb-3">Practical Training</h3>
              <p className="text-[var(--color-charcoal)] text-sm leading-relaxed">Real-world scenarios, return filing demos, and practical accounting exercises.</p>
            </div>
            
            <div className="text-center group hover:-translate-y-2 transition-transform duration-300" style={{ transitionDelay: '50ms' }}>
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <Clock className="w-10 h-10 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-dark)] mb-3">Learn at Your Own Pace</h3>
              <p className="text-[var(--color-charcoal)] text-sm leading-relaxed">Watch video lectures anytime, anywhere on any device. Pause and resume freely.</p>
            </div>
            
            <div className="text-center group hover:-translate-y-2 transition-transform duration-300" style={{ transitionDelay: '100ms' }}>
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <Shield className="w-10 h-10 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-dark)] mb-3">Lifetime Access</h3>
              <p className="text-[var(--color-charcoal)] text-sm leading-relaxed">Once enrolled, get lifetime access to course materials and future updates.</p>
            </div>
            
            <div className="text-center group hover:-translate-y-2 transition-transform duration-300" style={{ transitionDelay: '150ms' }}>
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <Award className="w-10 h-10 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-dark)] mb-3">Expert-Led Videos</h3>
              <p className="text-[var(--color-charcoal)] text-sm leading-relaxed">High-quality instruction from experienced tax professionals and CAs.</p>
            </div>
          </div>
        </Container>
      </section>



      {/* Testimonials */}
      <section className="py-24 bg-white border-t border-gray-100">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-dark)] mb-2">Student Success Stories</h2>
            <p className="text-[var(--color-charcoal)]">Join thousands who have transformed their careers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Sharma",
                role: "Senior Accountant",
                quote: "The practical approach to GSTR-9 and 9C in this course saved me hundreds of hours this filing season. The real-world case studies are exactly what I needed."
              },
              {
                name: "Priya Patel",
                role: "CA Final Student",
                quote: "I've bought many courses, but the depth of knowledge here is unmatched. The ITC reconciliation modules alone are worth 10x the price of the course."
              },
              {
                name: "Amit Kumar",
                role: "Business Owner",
                quote: "As a business owner, I needed to understand what my accountant was doing. This course broke down complex GST laws into simple, actionable steps."
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow relative">
                <div className="flex gap-1 text-orange-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-text-dark)]">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Banner */}
      <section className="relative py-32 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/cta-bg.png" 
            alt="Abstract Background" 
            fill 
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/90 to-gray-900/90" />
        </div>
        
        <Container className="relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">Ready to upgrade your taxation skills?</h2>
          <p className="mb-10 max-w-2xl mx-auto text-orange-100 text-xl font-medium drop-shadow">Join thousands of students and professionals who have advanced their careers with our practical courses.</p>
          <Link href="/courses">
            <Button size="lg" className="!bg-white !text-orange-600 hover:!text-orange-700 hover:!bg-orange-50 font-bold h-14 px-10 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              Start Learning Today
            </Button>
          </Link>
        </Container>
      </section>
    </div>
  );
}

// Ensure we have Badge import
import { Badge } from "@/components/ui/badge";
