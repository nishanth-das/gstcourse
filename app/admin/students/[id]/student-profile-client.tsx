"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function StudentProfileClient({ student, courses }: { student: any, courses: any[] }) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const anySupabase = supabase as any;
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [granting, setGranting] = useState(false);
  const [togglingRole, setTogglingRole] = useState(false);
  const [currentRole, setCurrentRole] = useState(student.role);

  useEffect(() => {
    fetchData();
  }, [student.id]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Enrollments
    const { data: enrollmentData } = await anySupabase
      .from("enrollments")
      .select("*, courses(title, slug)")
      .eq("user_id", student.id)
      .order("created_at", { ascending: false });

    // Fetch Orders
    const { data: orderData } = await anySupabase
      .from("orders")
      .select("*, courses(title)")
      .eq("user_id", student.id)
      .order("created_at", { ascending: false });

    if (enrollmentData) setEnrollments(enrollmentData);
    if (orderData) setOrders(orderData);
    setLoading(false);
  };

  const handleGrantAccess = async () => {
    if (!selectedCourseId) return;
    setGranting(true);

    // Check if enrollment already exists
    const existing = enrollments.find(e => e.course_id === selectedCourseId);
    if (existing) {
      if (existing.status !== 'active') {
        // Just re-activate it
        await anySupabase
          .from("enrollments")
          .update({ status: 'active', admin_notes: `Manually re-activated on ${new Date().toLocaleDateString()}` })
          .eq("id", existing.id);
      } else {
        alert("User already has active access to this course.");
      }
    } else {
      // Create new enrollment
      await anySupabase
        .from("enrollments")
        .insert({
          user_id: student.id,
          course_id: selectedCourseId,
          status: 'active',
          admin_notes: `Manually granted by admin on ${new Date().toLocaleDateString()}`
        });
    }

    setSelectedCourseId("");
    setGranting(false);
    fetchData();
  };

  const handleRevokeAccess = async (enrollmentId: string) => {
    if (confirm("Are you sure you want to revoke access? The student will no longer be able to view this course.")) {
      await anySupabase
        .from("enrollments")
        .update({ 
          status: 'revoked',
          admin_notes: `Manually revoked by admin on ${new Date().toLocaleDateString()}`
        })
        .eq("id", enrollmentId);
      
      fetchData();
    }
  };

  const handleToggleRole = async () => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    const msg = newRole === 'admin' 
      ? `Are you ABSOLUTELY SURE you want to promote ${student.email} to Admin? They will have full access to this dashboard.`
      : `Are you sure you want to demote this user back to a Student?`;
      
    if (confirm(msg)) {
      setTogglingRole(true);
      await anySupabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", student.id);
      
      setCurrentRole(newRole);
      setTogglingRole(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar Profile Info */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full text-2xl font-bold mx-auto mb-4 uppercase">
            {student.full_name ? student.full_name.charAt(0) : student.email.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-center text-gray-900">{student.full_name || 'Anonymous'}</h2>
          <p className="text-center text-gray-500 mb-6">{student.email}</p>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Joined</span>
              <span className="font-medium text-gray-900">{new Date(student.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">Role</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                ${currentRole === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}
              >
                {currentRole}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <Button 
              variant={currentRole === 'admin' ? 'outline' : 'secondary'} 
              className={`w-full ${currentRole !== 'admin' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
              onClick={handleToggleRole}
              disabled={togglingRole}
            >
              {currentRole === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Admins have full access to modify content and settings.
            </p>
          </div>
        </div>

        {/* Manual Access Grant Box */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Grant Course Access</h3>
          <p className="text-sm text-gray-500 mb-4">
            Manually enroll this user in a course without requiring payment.
          </p>
          <div className="space-y-3">
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="">Select a course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <Button 
              className="w-full" 
              onClick={handleGrantAccess} 
              disabled={!selectedCourseId || granting}
            >
              {granting ? "Granting..." : "Grant Access"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Enrollments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Active Enrollments</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : enrollments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">This user is not enrolled in any courses.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled On</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrollments.map((enrollment: any) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {enrollment.courses?.title || 'Unknown Course'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(enrollment.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${enrollment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {enrollment.status === 'active' && (
                          <button 
                            onClick={() => handleRevokeAccess(enrollment.id)} 
                            className="text-sm font-medium text-red-600 hover:underline"
                          >
                            Revoke Access
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Order History</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No order history for this user.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {order.courses?.title || 'Unknown Course'}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        ₹{order.amount}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
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
    </div>
  );
}
