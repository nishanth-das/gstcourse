import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Razorpay secret not configured' }, { status: 500 });
    }

    // 1. Verify Razorpay Signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. Fetch order via Admin Client
    const adminSupabase = createAdminClient();
    const anySupabase = adminSupabase as any;
    
    const { data: order, error: orderError } = await anySupabase
      .from('orders')
      .select('*, courses(title)')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    const typedOrder = order as any;

    // If already processed, return success
    if (typedOrder.status === 'paid') {
      return NextResponse.json({ success: true, already_processed: true });
    }

    // 3. Mark Order as Paid
    const { error: updateError } = await anySupabase
      .from('orders')
      .update({
        status: 'paid',
        razorpay_payment_id,
        razorpay_signature
      } as any)
      .eq('id', typedOrder.id);

    if (updateError) {
      throw new Error("Failed to update order status");
    }

    // 4. Increment Coupon Usage
    if (typedOrder.coupon_id) {
      // Need to query current times_used, then increment
      // Using an RPC call is safer for atomic increments, but we can do a read/write here for simplicity
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

    // 5. Create Enrollment
    const { error: enrollError } = await anySupabase
      .from('enrollments')
      .insert({
        user_id: typedOrder.user_id,
        course_id: typedOrder.course_id,
        order_id: typedOrder.id,
        status: 'active'
      } as any);

    if (enrollError) {
      console.error("Failed to enroll user:", enrollError);
      // We don't fail the request here, but we should log it.
    }

    // 6. Fetch user profile for emails
    let userEmail = 'customer@example.com';
    let userName = 'Customer';
    const courseName = (typedOrder as any)?.courses?.title || 'Your Course';
    
    try {
      const { data: userProfile } = await anySupabase
        .from('profiles')
        .select('*, auth.users!inner(email)')
        .eq('id', typedOrder.user_id)
        .single();
        
      if (userProfile) {
        userEmail = (userProfile as any)?.users?.email || 'customer@example.com';
        userName = (userProfile as any)?.full_name || 'Customer';
      }
    } catch (e) {
      console.error("Error fetching user profile for emails:", e);
    }

    // 7. Send Receipt Email to Customer
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'GSTCourse <noreply@gstcourse.in>',
          to: userEmail,
          subject: `Order Receipt: ${courseName}`,
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h1 style="color: #F97316;">GSTCourse.in</h1>
              <h2>Thank you for your purchase!</h2>
              <p>Your payment was successful and you are now enrolled.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${typedOrder.id}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Course:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${courseName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Amount Paid:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${typedOrder.amount}</td>
                </tr>
              </table>
              <p style="margin-top: 30px; text-align: center;">
                <a href="https://gstcourse.in/dashboard" style="background-color: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
              </p>
            </div>
          `
        });
      }
    } catch (emailError) {
      console.error("Failed to send customer receipt email:", emailError);
    }

    // 8. Send Admin Notification Email
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'GSTCourse <noreply@gstcourse.in>',
          to: 'subhrashreedey9@gmail.com',
          subject: `New Order: ${courseName} (₹${typedOrder.amount})`,
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #F97316;">New Order Received!</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${typedOrder.id}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Timestamp:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date().toISOString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Course:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${courseName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Amount:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${typedOrder.amount}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Customer Name:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${userName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Customer Email:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${userEmail}</td>
                </tr>
              </table>
            </div>
          `
        });
      }
    } catch (adminEmailError) {
      console.error("Failed to send admin notification email:", adminEmailError);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
