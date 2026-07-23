"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCoupons, saveCoupon, deleteCoupon } from "./actions";

export default function CouponsClient() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      if (data) setCoupons(data);
    } catch (e: any) {
      console.error(e);
      alert("Error loading coupons: " + e.message);
    }
    setLoading(false);
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setCode("");
    setDiscountType("percentage");
    setDiscountValue("");
    setExpiresAt("");
    setMaxUses("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon: any) => {
    setEditingId(coupon.id);
    setCode(coupon.code);
    setDiscountType(coupon.discount_type);
    setDiscountValue(String(coupon.discount_value));
    
    // Format timestamp for datetime-local input
    if (coupon.expires_at) {
      const date = new Date(coupon.expires_at);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      setExpiresAt(date.toISOString().slice(0, 16));
    } else {
      setExpiresAt("");
    }
    
    setMaxUses(coupon.usage_limit ? String(coupon.usage_limit) : "");
    setIsActive(coupon.is_active ?? true);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      code: code.toUpperCase().trim(),
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      usage_limit: maxUses ? parseInt(maxUses) : null,
      is_active: isActive
    };

    try {
      await saveCoupon(payload, editingId || undefined);
      setIsModalOpen(false);
      fetchData();
    } catch (e: any) {
      alert("Error saving coupon: " + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon? This might break historical order records if they reference this coupon directly.")) {
      try {
        await deleteCoupon(id);
        fetchData();
      } catch (e: any) {
        alert("Error deleting coupon: " + e.message);
      }
    }
  };

  if (loading) return <div className="animate-pulse">Loading coupons...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">All Coupons</h2>
        <Button onClick={handleOpenNew}>+ New Coupon</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {coupons.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No coupons found. Create one to start offering discounts.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((coupon) => {
                  const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
                  const isExhausted = coupon.usage_limit && (coupon.times_used || 0) >= coupon.usage_limit;
                  const isActuallyActive = coupon.is_active !== false && !isExpired && !isExhausted;

                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {coupon.times_used || 0} / {coupon.usage_limit ? coupon.usage_limit : '∞'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${isActuallyActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {isActuallyActive ? 'Active' : (coupon.is_active === false ? 'Disabled' : isExpired ? 'Expired' : 'Depleted')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <button onClick={() => handleOpenEdit(coupon)} className="text-sm font-medium text-[var(--color-primary)] hover:underline">Edit</button>
                        <button onClick={() => handleDelete(coupon.id)} className="text-sm font-medium text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? "Edit Coupon" : "Create Coupon"}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                <Input 
                  value={code} 
                  onChange={(e) => setCode(e.target.value.toUpperCase())} 
                  required 
                  placeholder="e.g. EARLYBIRD20"
                  className="font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                  <Input 
                    type="number"
                    min="0"
                    step={discountType === 'percentage' ? "1" : "0.01"}
                    max={discountType === 'percentage' ? "100" : undefined}
                    value={discountValue} 
                    onChange={(e) => setDiscountValue(e.target.value)} 
                    required 
                    placeholder={discountType === 'percentage' ? "20" : "500"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                <Input 
                  type="datetime-local"
                  value={expiresAt} 
                  onChange={(e) => setExpiresAt(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (Optional)</label>
                <Input 
                  type="number"
                  min="1"
                  value={maxUses} 
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <input 
                  type="checkbox" 
                  id="active-toggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="active-toggle" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Coupon is Active
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Coupon</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
