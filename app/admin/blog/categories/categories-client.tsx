"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BlogCategoriesClient() {
  const [categories, setCategories] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const supabase = createClient();
  const anySupabase = supabase as any;
  
  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: catData } = await anySupabase
      .from("blog_categories")
      .select("*")
      .order("sort_order", { ascending: true });
      
    const { data: postData } = await anySupabase
      .from("blog_posts")
      .select("id, category_id");

    if (catData) setCategories(catData);
    if (postData) setPosts(postData);
    setLoading(false);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    if (isEditing) {
      await anySupabase
        .from("blog_categories")
        .update({ name, slug })
        .eq("id", isEditing);
    } else {
      // Find max sort order
      const maxSort = categories.length > 0 ? Math.max(...categories.map(s => s.sort_order)) : -1;
      
      await anySupabase
        .from("blog_categories")
        .insert({ name, slug, sort_order: maxSort + 1 });
    }

    setName("");
    setSlug("");
    setIsEditing(null);
    fetchData();
  };

  const handleEdit = (category: any) => {
    setIsEditing(category.id);
    setName(category.name);
    setSlug(category.slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    // Check if posts are assigned
    const hasPosts = posts.some(p => p.category_id === id);
    if (hasPosts) {
      alert("Cannot delete this category because it has posts assigned to it. Please reassign the posts first.");
      return;
    }

    if (confirm("Are you sure you want to delete this category?")) {
      await anySupabase.from("blog_categories").delete().eq("id", id);
      fetchData();
    }
  };

  const moveCategory = async (id: string, direction: "up" | "down") => {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    const index = categories.findIndex(c => c.id === id);
    if (direction === "up" && index > 0) {
      const prev = categories[index - 1];
      await Promise.all([
        anySupabase.from("blog_categories").update({ sort_order: prev.sort_order }).eq("id", id),
        anySupabase.from("blog_categories").update({ sort_order: category.sort_order }).eq("id", prev.id)
      ]);
      fetchData();
    } else if (direction === "down" && index < categories.length - 1) {
      const next = categories[index + 1];
      await Promise.all([
        anySupabase.from("blog_categories").update({ sort_order: next.sort_order }).eq("id", id),
        anySupabase.from("blog_categories").update({ sort_order: category.sort_order }).eq("id", next.id)
      ]);
      fetchData();
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading categories...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Area */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {isEditing ? "Edit Category" : "Add New Category"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input 
                value={name} 
                onChange={(e) => handleNameChange(e.target.value)} 
                required 
                placeholder="e.g. Tax Updates"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <Input 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)} 
                required 
                placeholder="e.g. tax-updates"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">
                {isEditing ? "Save Changes" : "Add Category"}
              </Button>
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(null);
                    setName("");
                    setSlug("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* List Area */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Categories</h2>
          </div>
          
          <div className="p-2">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No categories found. Create one to get started.</div>
            ) : (
              <div className="space-y-2">
                {categories.map((cat, index) => {
                  const isFirst = index === 0;
                  const isLast = index === categories.length - 1;
                  
                  return (
                    <div key={cat.id} className="border border-gray-100 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <button disabled={isFirst} onClick={() => moveCategory(cat.id, "up")} className="text-gray-400 hover:text-gray-900 disabled:opacity-30">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            </button>
                            <button disabled={isLast} onClick={() => moveCategory(cat.id, "down")} className="text-gray-400 hover:text-gray-900 disabled:opacity-30">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">{cat.name}</span>
                            <span className="ml-2 text-xs text-gray-400 font-mono">/{cat.slug}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(cat)} className="text-sm text-blue-600 hover:underline">Edit</button>
                          <span className="text-gray-300">|</span>
                          <button onClick={() => handleDelete(cat.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
