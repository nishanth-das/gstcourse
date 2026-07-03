import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getGlobalSettings } from "@/lib/supabase/queries";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Users, Award, Shield, BookOpen, Clock, Target, Rocket } from "lucide-react";

export const metadata = {
  title: "About Us | GST Courses.in",
  description: "Learn about GST Courses.in and our mission to provide practical taxation education.",
};

export default async function AboutPage() {
  const settings = await getGlobalSettings();

  return (
    <div className="bg-white overflow-hidden selection:bg-orange-200">
      
      {/* 1. Elegant & Premium Hero Section */}
      <section className="relative pt-20 pb-40 md:pt-28 md:pb-52 bg-gray-900 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/about-hero.png" 
            alt="About GST Courses.in Background" 
            fill 
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/70 to-gray-900/95" />
        </div>
        
        <Container className="relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-md text-orange-300 text-sm font-semibold mb-8 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Transforming Tax Education in India
          </div>
          
          <h1 className="mb-6 text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-xl leading-tight">
            Beyond Theory. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
              Pure Practicality.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-300 drop-shadow-md font-medium leading-relaxed mb-10">
            We are a collective of elite tax professionals dedicated to closing the gap between academic knowledge and real-world compliance.
          </p>
        </Container>
      </section>

      {/* 2. Premium Overlapping Stats Strip */}
      <section className="relative z-20 -mt-24 mb-20 px-4">
        <Container>
          <div className="bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-gray-200 relative z-10">
              <div className="text-center group">
                <h4 className="text-4xl md:text-5xl font-black text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">10k+</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-3">Careers Upgraded</p>
              </div>
              <div className="text-center group">
                <h4 className="text-4xl md:text-5xl font-black text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">50+</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-3">Live Case Studies</p>
              </div>
              <div className="text-center group">
                <h4 className="text-4xl md:text-5xl font-black text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">15+</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-3">Years Expertise</p>
              </div>
              <div className="text-center group">
                <h4 className="text-4xl md:text-5xl font-black text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">24/7</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-3">Doubt Resolution</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. The Origin Story - Asymmetrical Image Gallery Layout */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-100 rounded-full blur-[100px] -translate-y-1/2 opacity-60 z-0"></div>
        <div className="absolute -right-20 top-20 text-[20rem] font-black text-gray-50 opacity-50 z-0 select-none pointer-events-none leading-none tracking-tighter">
          ORIGIN
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left: Text Content with refined typography */}
            <div className="space-y-8 order-2 lg:order-1">
              <div>
                <h3 className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-3 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-orange-600 inline-block"></span>
                  Our Genesis
                </h3>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-[1.1]">
                  Born from a simple <span className="text-[var(--color-primary)] relative whitespace-nowrap">frustration.<svg className="absolute -bottom-2 left-0 w-full h-3 text-orange-200" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg></span>
                </h2>
              </div>
              
              <div className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line border-l-4 border-orange-100 pl-6">
                {settings.about_text}
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center font-bold text-gray-500 shadow-md">CA</div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center font-bold text-gray-600 shadow-md">CS</div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-[var(--color-primary)] flex items-center justify-center font-bold text-white shadow-md">+</div>
                </div>
                <p className="text-sm font-bold text-gray-800">Curated by top<br/>industry professionals</p>
              </div>
            </div>
            
            {/* Right: Overlapping Image Gallery */}
            <div className="relative order-1 lg:order-2 h-[500px] sm:h-[600px] w-full">
              {/* Main Image */}
              <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 z-10 group">
                <Image 
                  src="/images/about-story.png" 
                  alt="Modern Financial Workspace" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent mix-blend-multiply" />
              </div>
              
              {/* Overlapping Secondary Image */}
              <div className="absolute bottom-0 left-0 w-3/5 h-2/5 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-4 ring-white z-20 group">
                <Image 
                  src="/images/about-office.png" 
                  alt="Corporate Conference Table" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[url('/images/dots-pattern.svg')] bg-repeat opacity-20 z-0"></div>
            </div>

          </div>
        </Container>
      </section>

      {/* 4. Elite Values Grid with Premium Cards */}
      <section className="py-32 bg-gray-50 relative border-t border-gray-100">
        <Container>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h3 className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-3">The Blueprint</h3>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">Built on uncompromising standards</h2>
            <p className="text-xl text-gray-600 font-medium">
              We don't just teach the law; we teach the mechanics of compliance. Here is what separates us from the rest.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150 z-0"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white shadow-md border border-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-600 transition-colors duration-500">
                  <Target className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Precision Focus</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Every module is meticulously engineered to address real bottlenecks accountants face on the actual GST portal.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150 z-0"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white shadow-md border border-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-600 transition-colors duration-500">
                  <Rocket className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Rapid Execution</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Learn workflows and shortcuts that cut your return filing time in half. We focus on efficiency and accuracy.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150 z-0"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white shadow-md border border-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-600 transition-colors duration-500">
                  <Shield className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Bulletproof Compliance</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Master ITC reconciliations and notice handling to keep your clients 100% safe from departmental scrutiny.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Stunning CTA Banner */}
      <section className="relative py-32 overflow-hidden">
        {/* Deep, rich gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0" />
        
        {/* Large decorative circles */}
        <div className="absolute top-0 left-0 w-[50rem] h-[50rem] bg-orange-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-orange-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
        
        <Container className="relative z-10 text-center text-white">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
            <Award className="w-10 h-10 text-orange-400" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-2xl tracking-tight">
            Stop guessing. <br className="md:hidden" />Start mastering.
          </h2>
          <p className="mb-12 max-w-2xl mx-auto text-gray-300 text-xl font-medium drop-shadow-sm leading-relaxed">
            Join the elite tier of accountants who command respect and high fees through flawless GST compliance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/courses">
              <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-white font-black h-16 px-12 text-lg shadow-[0_0_40px_rgba(247,148,29,0.4)] hover:shadow-[0_0_60px_rgba(247,148,29,0.6)] hover:-translate-y-1 transition-all duration-300 rounded-xl">
                Browse Courses Now
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
