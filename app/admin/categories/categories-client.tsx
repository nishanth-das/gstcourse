"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CategoriesClient() {
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const supabase = createClient();
  const anySupabase = supabase as any;
  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: catData } = await anySupabase
        .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
      
    const { data: courseData } = await anySupabase
        .from("courses")
      .select("id, category_id");

    if (catData) setCategories(catData);
    if (courseData) setCourses(courseData);
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
        .from("categories")
        .update({ name, slug, parent_id: parentId })
        .eq("id", isEditing);
    } else {
      // Find max sort order
      const siblings = categories.filter(c => c.parent_id === parentId);
      const maxSort = siblings.length > 0 ? Math.max(...siblings.map(s => s.sort_order)) : -1;
      
      await anySupabase
        .from("categories")
        .insert({ name, slug, parent_id: parentId, sort_order: maxSort + 1 });
    }

    setName("");
    setSlug("");
    setParentId(null);
    setIsEditing(null);
    fetchData();
  };

  const handleEdit = (category: any) => {
    setIsEditing(category.id);
    setName(category.name);
    setSlug(category.slug);
    setParentId(category.parent_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    // Check if courses are assigned
    const hasCourses = courses.some(c => c.category_id === id);
    if (hasCourses) {
      alert("Cannot delete this category because it has courses assigned to it. Please reassign the courses first.");
      return;
    }

    // Check if it has subcategories
    const hasChildren = categories.some(c => c.parent_id === id);
    if (hasChildren) {
      alert("Cannot delete this category because it has subcategories. Delete or reassign them first.");
      return;
    }

    if (confirm("Are you sure you want to delete this category?")) {
      await anySupabase.from("categories").delete().eq("id", id);
      fetchData();
    }
  };

  const moveCategory = async (id: string, direction: "up" | "down") => {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    const siblings = categories
      .filter(c => c.parent_id === category.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order);

    const index = siblings.findIndex(c => c.id === id);
    if (direction === "up" && index > 0) {
      const prev = siblings[index - 1];
      await Promise.all([
        anySupabase.from("categories").update({ sort_order: prev.sort_order }).eq("id", id),
        anySupabase.from("categories").update({ sort_order: category.sort_order }).eq("id", prev.id)
      ]);
      fetchData();
    } else if (direction === "down" && index < siblings.length - 1) {
      const next = siblings[index + 1];
      await Promise.all([
        anySupabase.from("categories").update({ sort_order: next.sort_order }).eq("id", id),
        anySupabase.from("categories").update({ sort_order: category.sort_order }).eq("id", next.id)
      ]);
      fetchData();
    }
  };

  // Build tree
  const rootCategories = categories.filter(c => !c.parent_id);

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
                placeholder="e.g. GST Returns"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <Input 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)} 
                required 
                placeholder="e.g. gst-returns"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={parentId || ""}
                onChange={(e) => setParentId(e.target.value || null)}
              >
                <option value="">None (Top Level)</option>
                {rootCategories.map(c => (
                  <option key={c.id} value={c.id} disabled={c.id === isEditing}>
                    {c.name}
                  </option>
                ))}
              </select>
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
                    setParentId(null);
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
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Category Structure</h2>
          </div>
          
          <div className="p-2">
            {rootCategories.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No categories found. Create one to get started.</div>
            ) : (
              <div className="space-y-2">
                {rootCategories.map((cat, index) => {
                  const children = categories.filter(c => c.parent_id === cat.id);
                  const isFirst = index === 0;
                  const isLast = index === rootCategories.length - 1;
                  
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
                      
                      {children.length > 0 && (
                        <div className="bg-gray-50 p-2 pl-12 border-t border-gray-100 space-y-1">
                          {children.map((child, cIndex) => {
                            const cIsFirst = cIndex === 0;
                            const cIsLast = cIndex === children.length - 1;
                            
                            return (
                              <div key={child.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col">
                                    <button disabled={cIsFirst} onClick={() => moveCategory(child.id, "up")} className="text-gray-400 hover:text-gray-900 disabled:opacity-30">
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                    </button>
                                    <button disabled={cIsLast} onClick={() => moveCategory(child.id, "down")} className="text-gray-400 hover:text-gray-900 disabled:opacity-30">
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-800">{child.name}</span>
                                    <span className="ml-2 text-xs text-gray-400 font-mono">/{child.slug}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => handleEdit(child)} className="text-sm text-blue-600 hover:underline">Edit</button>
                                  <span className="text-gray-300">|</span>
                                  <button onClick={() => handleDelete(child.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
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
