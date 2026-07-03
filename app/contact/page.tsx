import { Container } from "@/components/ui/container";
import { getGlobalSettings } from "@/lib/supabase/queries";
import ContactClient from "./contact-client";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Contact Us | GST Courses.in",
  description: "Get in touch with the GST Courses team. Call us, WhatsApp us, or send us an email.",
};

export default async function ContactPage() {
  const settings = await getGlobalSettings();

  // Format phone number for WhatsApp
  const waNumber = settings.contact_phone?.replace(/[^0-9]/g, '');

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      {/* 1. Elegant & Premium Hero Section */}
      <section className="relative pt-20 pb-40 md:pt-28 md:pb-52 bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/contact-hero.png" 
            alt="Contact GST Courses.in" 
            fill 
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/70 to-gray-900/95" />
        </div>
        
        <Container className="relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-md text-orange-300 text-sm font-semibold mb-8 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            We are here to help
          </div>
          
          <h1 className="mb-6 text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-xl leading-tight">
            Let's Start a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
              Conversation.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-300 drop-shadow-md font-medium leading-relaxed">
            Have a question about our courses, pricing, or need technical support? Pick your preferred way to reach us below.
          </p>
        </Container>
      </section>

      {/* 2. Floating Contact Channel Cards */}
      <section className="relative z-20 -mt-24 px-4 mb-20">
        <Container className="max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Call Direct */}
            {settings.contact_phone && (
              <a href={`tel:${waNumber}`} className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                  <Phone className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us Directly</h3>
                <p className="text-gray-500 mb-4 text-sm">Speak with our support team instantly.</p>
                <p className="text-lg font-bold text-[var(--color-primary)] mt-auto">
                  {settings.contact_phone}
                </p>
              </a>
            )}

            {/* WhatsApp */}
            {settings.contact_phone && (
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors duration-300">
                  <MessageCircle className="w-8 h-8 text-green-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chat on WhatsApp</h3>
                <p className="text-gray-500 mb-4 text-sm">Get quick answers via chat.</p>
                <p className="text-lg font-bold text-green-600 mt-auto">
                  Send a Message
                </p>
              </a>
            )}

            {/* Email */}
            <a href={`mailto:${settings.contact_email}`} className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-300">
                <Mail className="w-8 h-8 text-blue-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-500 mb-4 text-sm">Detailed inquiries and document sharing.</p>
              <p className="text-lg font-bold text-blue-600 mt-auto">
                {settings.contact_email}
              </p>
            </a>

          </div>
        </Container>
      </section>

      {/* 3. Dedicated Form Section */}
      <section className="px-4">
        <Container className="max-w-4xl">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-16">
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Send us a direct message</h2>
                <p className="text-gray-500 text-lg">
                  Prefer to write to us? Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <ContactClient />
              </div>
            </div>
            
            {/* Address Footer inside the form card */}
            {settings.contact_address && (
              <div className="bg-gray-50 border-t border-gray-100 p-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Our Headquarters</p>
                  <p className="text-gray-600 whitespace-pre-line">{settings.contact_address}</p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
