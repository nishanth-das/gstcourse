import { getUser } from "@/lib/supabase/queries";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }

  const { query, status } = await searchParams;
  const q = typeof query === "string" ? query : "";
  const s = typeof status === "string" ? status : "";

  const anySupabase = createAdminClient() as any;
  let dbQuery = anySupabase
    .from("orders")
    .select("*, courses(title)")
    .order("created_at", { ascending: false });

  if (s) {
    dbQuery = dbQuery.eq("status", s);
  }
  if (q) {
    dbQuery = dbQuery.or(`razorpay_order_id.ilike.%${q}%,razorpay_payment_id.ilike.%${q}%`);
  }

  const { data: rawOrders } = await dbQuery;
  
  // Manually fetch profiles since foreign key points to auth.users
  let orders = rawOrders || [];
  if (orders.length > 0) {
    const userIds = Array.from(new Set(orders.map((o: any) => o.user_id).filter(Boolean)));
    if (userIds.length > 0) {
      const { data: profiles } = await anySupabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
        
      const { data: authData } = await anySupabase.auth.admin.listUsers({ perPage: 1000 });
      const authUsers = authData?.users || [];
      const emailMap = new Map(authUsers.map((u: any) => [u.id, u.email]));
        
      const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);
      orders = orders.map((o: any) => ({
        ...o,
        profiles: {
          ...(profileMap.get(o.user_id) || {}),
          email: emailMap.get(o.user_id) || null
        }
      }));
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders & Revenue</h1>
          <p className="text-gray-500 mt-1">View all course purchases and payment statuses.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4">
        <form className="flex-1 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 max-w-md w-full">
            <input 
              type="text"
              name="query"
              defaultValue={q}
              placeholder="Search by Razorpay Order or Payment ID..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="w-full sm:w-48">
            <select 
              name="status"
              defaultValue={s}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Statuses</option>
              <option value="created">Created (Unpaid)</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <Button type="submit" className="h-10">Filter</Button>

          {(q || s) && (
            <Link href="/admin/orders">
              <Button type="button" variant="outline" className="h-10">Clear</Button>
            </Link>
          )}
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {(!orders || orders.length === 0) ? (
          <div className="p-12 text-center text-gray-500">
            No orders found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gateway IDs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{order.profiles?.full_name || 'Anonymous'}</div>
                      <Link href={`/admin/students/${order.user_id}`} className="text-sm text-blue-600 hover:underline">
                        {order.profiles?.email}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {order.courses?.title || 'Unknown Course'}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">
                      ₹{order.amount}
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
                    <td className="py-4 px-6 text-xs text-gray-500 font-mono">
                      <div><span className="font-semibold text-gray-400">Order:</span> {order.razorpay_order_id || '-'}</div>
                      <div><span className="font-semibold text-gray-400">Payment:</span> {order.razorpay_payment_id || '-'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
