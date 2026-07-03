import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const { course_id, coupon_code } = await request.json();

    if (!course_id) {
      return NextResponse.json({ error: 'Missing course_id' }, { status: 400 });
    }

    // 1. Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to query course and coupons to bypass RLS securely
    const adminSupabase = createAdminClient();
    const anySupabase = adminSupabase as any;

    // 2. Fetch real course price
    const { data: course, error: courseError } = await anySupabase
      .from('courses')
      .select('price, currency')
      .eq('id', course_id)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const typedCourse = course as any;
    let finalAmount = Number(typedCourse.price);
    let appliedCouponId = null;

    // 3. Validate and apply coupon
    if (coupon_code) {
      const { data: coupon, error: couponError } = await anySupabase
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .single();

      if (!couponError && coupon) {
        const typedCoupon = coupon as any;
        // Check expiry and limits
        const isExpired = typedCoupon.expires_at && new Date(typedCoupon.expires_at) < new Date();
        const isExhausted = typedCoupon.usage_limit && typedCoupon.times_used >= typedCoupon.usage_limit;

        if (!isExpired && !isExhausted) {
          appliedCouponId = typedCoupon.id;
          if (typedCoupon.discount_type === 'percentage') {
            finalAmount = finalAmount - (finalAmount * Number(typedCoupon.discount_value)) / 100;
          } else if (typedCoupon.discount_type === 'flat') {
            finalAmount = finalAmount - Number(typedCoupon.discount_value);
          }
          if (finalAmount < 0) finalAmount = 0;
        }
      }
    }

    // 4. Initialize Razorpay
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Amount in paise
    const amountInPaise = Math.round(finalAmount * 100);

    // 5. Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: typedCourse.currency || 'INR',
      receipt: `rcpt_${user.id}_${Date.now()}`.substring(0, 40),
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
    }

    // 6. Record order in database
    const { error: insertError } = await anySupabase
      .from('orders')
      .insert({
        user_id: user.id,
        course_id: course_id,
        amount: finalAmount,
        currency: typedCourse.currency || 'INR',
        razorpay_order_id: order.id,
        status: 'created',
        coupon_id: appliedCouponId,
      } as any);

    if (insertError) {
      console.error("Order insertion error:", insertError);
      return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
