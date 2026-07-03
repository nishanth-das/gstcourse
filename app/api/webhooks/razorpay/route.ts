import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // 1. Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    // 2. Parse Payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;

    const adminSupabase = createAdminClient();
    const anySupabase = adminSupabase as any;

    if (event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      const razorpay_order_id = payment.order_id;
      const razorpay_payment_id = payment.id;

      // Find the order
      const { data: order } = await anySupabase
        .from('orders')
        .select('*')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();

      if (order && (order as any).status !== 'paid') {
        const typedOrder = order as any;
        // Mark as paid
        await anySupabase
          .from('orders')
          .update({
            status: 'paid',
            razorpay_payment_id,
            razorpay_signature: signature // storing webhook signature as a fallback
          } as any)
          .eq('id', typedOrder.id);

        // Increment coupon
        if (typedOrder.coupon_id) {
          const { data: coupon } = await anySupabase
            .from('coupons')
            .select('times_used')
            .eq('id', typedOrder.coupon_id)
            .single();
            
          if (coupon) {
            const typedCoupon = coupon as any;
            await anySupabase
              .from('coupons')
              .update({ times_used: (typedCoupon.times_used || 0) + 1 } as any)
              .eq('id', typedOrder.coupon_id);
          }
        }

        // Create enrollment
        await anySupabase
          .from('enrollments')
          .insert({
            user_id: typedOrder.user_id,
            course_id: typedOrder.course_id,
            order_id: typedOrder.id,
            status: 'active'
          } as any);
          
        // Webhooks don't send emails to avoid duplication if client verification already did it,
        // unless you build a mechanism to track if email was already sent.
      }
    } else if (event === 'payment.failed') {
      const payment = payload.payload.payment.entity;
      const razorpay_order_id = payment.order_id;

      const { data: order } = await adminSupabase
        .from('orders')
        .select('id, status')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();

      if (order && (order as any).status !== 'paid') {
        await anySupabase
          .from('orders')
          .update({ status: 'failed' } as any)
          .eq('id', (order as any).id);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
