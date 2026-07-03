"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate sending email/message
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[var(--color-text-dark)]">Message Sent!</h3>
        <p className="text-[var(--color-charcoal)]">Thank you for reaching out. We will get back to you shortly.</p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-4">
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-dark)] mb-1">Full Name</label>
        <Input id="name" name="name" required placeholder="John Doe" className="w-full" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-dark)] mb-1">Email Address</label>
        <Input id="email" name="email" type="email" required placeholder="john@example.com" className="w-full" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-dark)] mb-1">Message</label>
        <textarea 
          id="message" 
          name="message" 
          required 
          rows={4}
          className="flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)]"
          placeholder="How can we help you?"
        ></textarea>
      </div>
      <Button type="submit" className="w-full h-11 text-base">Send Message</Button>
    </form>
  );
}
