import { createAdminClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const user = await getUser();
  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }

  const anySupabase = createAdminClient() as any;
  // 1. Total Courses (Published)
  const { count: coursesCount } = await anySupabase
    .from("courses")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  // 2. Total Students
  const { count: studentsCount } = await anySupabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  // 3. Total Revenue
  const { data: revenueData } = await anySupabase
    .from("orders")
    .select("amount")
    .eq("status", "paid");
    
  const totalRevenue = revenueData 
    ? revenueData.reduce((sum: number, order: any) => sum + (order.amount || 0), 0)
    : 0;

  // 4. Recent Orders
  const { data: rawRecentOrders } = await anySupabase
    .from("orders")
    .select("id, amount, status, created_at, user_id, courses(title)")
    .order("created_at", { ascending: false })
    .limit(5);

  let recentOrders = rawRecentOrders || [];
  if (recentOrders.length > 0) {
    const userIds = Array.from(new Set(recentOrders.map((o: any) => o.user_id).filter(Boolean)));
    if (userIds.length > 0) {
      const { data: profiles } = await anySupabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
        
      const { data: authData } = await anySupabase.auth.admin.listUsers({ perPage: 1000 });
      const authUsers = authData?.users || [];
      const emailMap = new Map(authUsers.map((u: any) => [u.id, u.email]));
        
      const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);
      recentOrders = recentOrders.map((o: any) => ({
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user.user_metadata?.full_name || 'Admin'}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Published Courses</p>
            <p className="text-2xl font-bold text-gray-900">{coursesCount || 0}</p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mr-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{studentsCount || 0}</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mr-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-[var(--color-primary)] font-medium hover:underline">
            View All
          </Link>
        </div>
        
        {(!recentOrders || recentOrders.length === 0) ? (
          <div className="p-8 text-center text-gray-500">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">
                      <div className="text-sm font-medium text-gray-900">{order.profiles?.full_name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{order.profiles?.email}</div>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-900">
                      {order.courses?.title || 'Unknown Course'}
                    </td>
                    <td className="py-3 px-6 text-sm font-medium text-gray-900">
                      ₹{order.amount}
                    </td>
                    <td className="py-3 px-6">
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
          </div>
        )}
      </div>
    </div>
  );
}
