"use client";

import { useState, useEffect, use } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Script from "next/script";

// Add Razorpay types to window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage({ params }: { params: Promise<{ "course-slug": string }> }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams["course-slug"];
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function initCheckout() {
      // 1. Check auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?redirectTo=/checkout/${slug}`);
        return;
      }

      const anySupabase = supabase as any;

      // Fetch profile for pre-filling email/name
      const { data: profile } = await anySupabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      const typedProfile = profile as any;
      setUserProfile({ email: user.email, name: typedProfile?.full_name });

      // 2. Fetch course
      const { data: courseData, error: courseError } = await anySupabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (courseError || !courseData) {
        router.push("/courses");
        return;
      }

      const typedCourse = courseData as any;
      setCourse(typedCourse);

      // 3. Check if already enrolled
      const { data: enrollment } = await anySupabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", typedCourse.id)
        .eq("status", "active")
        .single();

      if (enrollment) {
        router.push("/dashboard");
        return;
      }

      setLoading(false);
    }

    initCheckout();
  }, [slug, router, supabase]);

  const handlePayment = async () => {
    if (!course) return;
    setProcessing(true);
    setError(null);

    try {
      // 1. Create order on our server
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: course.id,
          coupon_code: couponCode
        })
      });

      const orderData = await res.json();
      
      if (!res.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // 2. Initialize Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "GSTCourses.in",
        description: course.title,
        order_id: orderData.orderId,
        prefill: {
          name: userProfile?.name || "",
          email: userProfile?.email || "",
        },
        theme: {
          color: "#F97316" // var(--color-primary)
        },
        handler: async function (response: any) {
          // 3. Verify payment on our server
          try {
            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok) {
              router.push("/checkout/success");
            } else {
              throw new Error(verifyData.error || "Verification failed");
            }
          } catch (err: any) {
            console.error(err);
            router.push("/checkout/failure");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error(response.error);
        router.push("/checkout/failure");
      });

      rzp.open();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-surface)] py-12 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-surface)] py-12 px-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <Container className="max-w-4xl">
        <h1 className="text-3xl font-bold text-[var(--color-text-dark)] mb-8">Secure Checkout</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-[var(--color-text-dark)] mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="flex gap-4">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-32 h-24 object-cover rounded-md" />
                ) : (
                  <div className="w-32 h-24 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                
                <div className="flex-grow">
                  <h3 className="font-bold text-[var(--color-text-dark)] text-lg mb-1">{course.title}</h3>
                  <p className="text-sm text-[var(--color-charcoal)] line-clamp-2 mb-2">
                    {course.short_description}
                  </p>
                </div>
                
                <div className="text-right flex flex-col items-end justify-center">
                  {course.compare_at_price && course.compare_at_price > course.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{course.compare_at_price}
                    </span>
                  )}
                  <span className="font-bold text-xl text-[var(--color-text-dark)] leading-none">
                    ₹{course.price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-[var(--color-text-dark)] mb-4">Payment Details</h2>
              
              <div className="mb-6">
                <label className="block text-xs font-medium text-[var(--color-charcoal)] mb-1 uppercase tracking-wider">Coupon Code</label>
                <div className="flex gap-2">
                  <Input 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code" 
                    className="flex-grow uppercase"
                  />
                  {/* Coupon validation actually happens server side during create-order, this UI is simple for now */}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[var(--color-text-dark)]">Total:</span>
                  <span className="font-bold text-2xl text-[var(--color-text-dark)]">₹{course.price}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                  {error}
                </div>
              )}

              <Button 
                className="w-full h-12 text-lg" 
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "Pay Now"}
              </Button>
              <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure payments powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
