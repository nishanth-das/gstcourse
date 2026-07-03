"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export default function SettingsClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const anySupabase = supabase as any;
  const [settings, setSettings] = useState({
    hero_headline: "Master GST Return Filing in India",
    hero_subheadline: "The most comprehensive, practical, and up-to-date GST course designed for accountants, business owners, and tax professionals.",
    stats_students: "5000+",
    stats_rating: "4.9/5",
    contact_email: "support@gstcourse.in",
    contact_phone: "+91 98765 43210",
    contact_address: "123 Financial District, New Delhi, India 110001",
    about_text: "We are a team of Chartered Accountants and tax experts dedicated to simplifying GST compliance for everyone in India. Founded in 2020, we have helped thousands of students master practical return filing.",
    header_menus: [
      { id: "1", label: "Home", url: "/", type: "link" },
      { id: "2", label: "Courses", url: "/courses", type: "category_dropdown" },
      { id: "3", label: "About", url: "/about", type: "link" },
      { id: "4", label: "Contact", url: "/contact", type: "link" }
    ]
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await anySupabase
        .from("site_settings")
      .select("value")
      .eq("key", "global")
      .single();

    if (data && data.value) {
      setSettings(prev => ({ ...prev, ...data.value }));
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleMenuChange = (id: string, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      header_menus: prev.header_menus.map((menu: any) => 
        menu.id === id ? { ...menu, [field]: value } : menu
      )
    }));
  };

  const handleMenuMove = (index: number, direction: 'up' | 'down') => {
    const menus = [...settings.header_menus];
    if (direction === 'up' && index > 0) {
      const temp = menus[index];
      menus[index] = menus[index - 1];
      menus[index - 1] = temp;
    } else if (direction === 'down' && index < menus.length - 1) {
      const temp = menus[index];
      menus[index] = menus[index + 1];
      menus[index + 1] = temp;
    }
    setSettings(prev => ({ ...prev, header_menus: menus }));
  };

  const handleMenuDelete = (id: string) => {
    setSettings(prev => ({
      ...prev,
      header_menus: prev.header_menus.filter((menu: any) => menu.id !== id)
    }));
  };

  const handleMenuAdd = () => {
    const newMenu = {
      id: Math.random().toString(36).substring(7),
      label: "New Link",
      url: "/",
      type: "link"
    };
    setSettings(prev => ({
      ...prev,
      header_menus: [...prev.header_menus, newMenu]
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await anySupabase
        .from("site_settings")
      .upsert({ 
        key: "global", 
        value: settings 
      }, { onConflict: "key" });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Settings saved successfully!" });
      router.refresh();
    }
    
    setSaving(false);
  };

  if (loading) return <div className="animate-pulse">Loading settings...</div>;

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-4xl space-y-8">
      
      {message && (
        <div className={`p-4 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
          {message.text}
        </div>
      )}

      {/* Header Navigation Settings */}
      <div>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Header Navigation</h2>
          <Button type="button" onClick={handleMenuAdd} variant="outline" size="sm" className="gap-1">
            <Plus className="w-4 h-4" /> Add Link
          </Button>
        </div>
        
        <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
          {settings.header_menus && settings.header_menus.map((menu: any, index: number) => (
            <div key={menu.id} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => handleMenuMove(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => handleMenuMove(index, 'down')} disabled={index === settings.header_menus.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 flex-1">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Label</label>
                  <Input 
                    value={menu.label} 
                    onChange={(e) => handleMenuChange(menu.id, 'label', e.target.value)} 
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">URL path</label>
                  <Input 
                    value={menu.url} 
                    onChange={(e) => handleMenuChange(menu.id, 'url', e.target.value)} 
                    className="h-9"
                  />
                </div>
              </div>

              <div className="w-40">
                <label className="block text-xs text-gray-500 mb-1">Type</label>
                <select 
                  value={menu.type} 
                  onChange={(e) => handleMenuChange(menu.id, 'type', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="link">Standard Link</option>
                  <option value="category_dropdown">Courses Dropdown</option>
                </select>
              </div>

              <button 
                type="button" 
                onClick={() => handleMenuDelete(menu.id)}
                className="mt-5 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Homepage Settings */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Homepage Content</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Headline</label>
            <Input name="hero_headline" value={settings.hero_headline} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subheadline</label>
            <textarea
              name="hero_subheadline"
              rows={2}
              value={settings.hero_subheadline}
              onChange={handleChange}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trust Stat: Total Students</label>
              <Input name="stats_students" value={settings.stats_students} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trust Stat: Average Rating</label>
              <Input name="stats_rating" value={settings.stats_rating} onChange={handleChange} required />
            </div>
          </div>
        </div>
      </div>

      {/* About Page Settings */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">About Page</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
            <textarea
              name="about_text"
              rows={4}
              value={settings.about_text}
              onChange={handleChange}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
          </div>
        </div>
      </div>

      {/* Contact Settings */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <Input type="email" name="contact_email" value={settings.contact_email} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input name="contact_phone" value={settings.contact_phone} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
            <textarea
              name="contact_address"
              rows={4}
              value={settings.contact_address}
              onChange={handleChange}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving Changes..." : "Save All Settings"}
        </Button>
      </div>
    </form>
  );
}
