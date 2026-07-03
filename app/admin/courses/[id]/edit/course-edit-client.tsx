"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CourseEditClient({ initialCourse, categories }: { initialCourse: any, categories: any[] }) {
  const router = useRouter();
  const supabase = createClient();
  const anySupabase = supabase as any;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialCourse?.title || "",
    slug: initialCourse?.slug || "",
    category_id: initialCourse?.category_id || "",
    short_description: initialCourse?.short_description || "",
    long_description: initialCourse?.long_description || "",
    price: initialCourse?.price || 0,
    compare_at_price: initialCourse?.compare_at_price || "",
    status: initialCourse?.status || "draft",
    level: initialCourse?.level || "Beginner",
    language: initialCourse?.language || "English",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialCourse?.thumbnail_url || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from title if we are creating a new course and slug hasn't been manually edited
    if (name === "title" && !initialCourse) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Enforce 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let thumbnailUrl = initialCourse?.thumbnail_url;

      // Upload thumbnail if changed
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('course-thumbnails')
          .upload(filePath, thumbnailFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('course-thumbnails')
          .getPublicUrl(filePath);
          
        thumbnailUrl = publicUrl;
      }

      const payload = {
        title: formData.title,
        slug: formData.slug,
        category_id: formData.category_id || null,
        short_description: formData.short_description,
        long_description: formData.long_description,
        price: parseFloat(formData.price.toString()),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price.toString()) : null,
        status: formData.status,
        level: formData.level,
        language: formData.language,
        thumbnail_url: thumbnailUrl
      };

      if (initialCourse) {
        // Update
        const { error: updateError } = await anySupabase
        .from("courses")
          .update(payload)
          .eq("id", initialCourse.id);
        
        if (updateError) throw updateError;
        router.push("/admin/courses");
      } else {
        // Insert
        const { data: newCourse, error: insertError } = await anySupabase
        .from("courses")
          .insert(payload)
          .select("id")
          .single();
          
        if (insertError) throw insertError;
        
        // Prompt to add lessons
        if (confirm("Course created successfully! Would you like to manage its curriculum (modules and lessons) now?")) {
          router.push(`/admin/courses/${newCourse.id}/lessons`);
        } else {
          router.push("/admin/courses");
        }
      }
      
      router.refresh();

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-4xl">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left Column: Core Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
            <Input 
              name="title"
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
            <Input 
              name="slug"
              value={formData.slug} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">None</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹) *</label>
              <Input 
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare At Price (₹)</label>
              <Input 
                type="number"
                name="compare_at_price"
                min="0"
                step="0.01"
                value={formData.compare_at_price} 
                onChange={handleChange} 
                placeholder="e.g. 4999"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <Input 
                name="level"
                value={formData.level} 
                onChange={handleChange} 
                placeholder="e.g. Beginner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <Input 
                name="language"
                value={formData.language} 
                onChange={handleChange} 
                placeholder="e.g. English"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="draft">Draft (Hidden)</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Right Column: Media & Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail (1280x720px, Max 5MB)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md overflow-hidden relative">
              {thumbnailPreview ? (
                <div className="absolute inset-0">
                  <Image src={thumbnailPreview} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-md font-medium text-sm">
                      Change Image
                      <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-[var(--color-primary)] hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--color-primary)]">
                      <span>Upload a file</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">1280x720px (16:9), up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea
              name="short_description"
              rows={3}
              value={formData.short_description}
              onChange={handleChange}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="A brief summary for the course card..."
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Long Description (Markdown Supported)
        </label>
        <p className="text-xs text-gray-500 mb-2">This appears on the main course sales page.</p>
        <textarea
          name="long_description"
          rows={12}
          value={formData.long_description}
          onChange={handleChange}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="## What you'll learn&#10;&#10;- Topic 1&#10;- Topic 2"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/courses")}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialCourse ? "Save Changes" : "Create Course"}
        </Button>
      </div>
    </form>
  );
}
