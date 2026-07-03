import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const anySupabase = supabase as any;
  const { data: orders, error } = await anySupabase
    .from("orders")
    .select("*, courses(title)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-text-dark)] mb-6">
        Order History
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {(!orders || orders.length === 0) ? (
              <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-dark)] mb-2">No Orders Found</h3>
                <p className="text-[var(--color-charcoal)] mb-6">
                  You haven't placed any orders yet.
                </p>
                <a href="/courses" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[var(--color-primary)] text-primary-foreground hover:bg-[var(--color-primary-dark)] h-10 px-4 py-2">
                  Browse Courses
                </a>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Order ID / Date</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Course</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900 mb-1">{order.id.split('-')[0]}...</div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">
                          {order.courses?.title || "Unknown Course"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{order.amount}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            order.status === 'created' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
      </div>
    </div>
  );
}
