"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import ImageNode from '@tiptap/extension-image';
import Image from "next/image";

// Tiptap Menu Bar Component
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Bold
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Italic
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('strike') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Strike
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().setParagraph().run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('paragraph') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        P
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        H2
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        H3
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Bullet List
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Ordered List
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('blockquote') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Quote
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button
        onClick={(e) => {
          e.preventDefault();
          const url = window.prompt('URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('link') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Link
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          const url = window.prompt('Image URL');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="px-2 py-1 text-sm font-medium rounded text-gray-600 hover:bg-gray-100"
      >
        Image
      </button>
    </div>
  );
};

export default function BlogPostEditClient({ 
  initialPost, 
  categories 
}: { 
  initialPost: any, 
  categories: any[] 
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const anySupabase = supabase as any;

  // Form State
  const [formData, setFormData] = useState({
    title: initialPost?.title || "",
    slug: initialPost?.slug || "",
    excerpt: initialPost?.excerpt || "",
    category_id: initialPost?.category_id || "",
    status: initialPost?.status || "draft",
    meta_title: initialPost?.meta_title || "",
    meta_description: initialPost?.meta_description || "",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialPost?.cover_image_url || null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      ImageNode,
    ],
    content: initialPost?.content || "",
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[300px]',
      },
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug if title changes and it's a new post (or if user hasn't manually edited slug much)
      ...(name === 'title' && !initialPost ? {
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      } : {})
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max width 1200px for blog covers
          const MAX_WIDTH = 1200;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Export as webp, 80% quality
          canvas.toBlob((blob) => {
            if (blob) {
              const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: 'image/webp',
              });
              setCoverFile(newFile);
              setCoverPreview(URL.createObjectURL(blob));
            }
          }, 'image/webp', 0.8);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !editor) {
      alert("Title and Slug are required.");
      return;
    }

    setSaving(true);
    try {
      let coverUrl = initialPost?.cover_image_url;

      // Upload cover if changed
      if (coverFile) {
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.webp`;
        const filePath = `covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-covers')
          .upload(filePath, coverFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('blog-covers')
          .getPublicUrl(filePath);
          
        coverUrl = publicUrl;
      }

      // Get author id
      const { data: { user } } = await supabase.auth.getUser();
      const authorId = user?.id;

      const postData = {
        ...formData,
        cover_image_url: coverUrl,
        content: editor.getHTML(),
        author_id: authorId,
        // Set published_at if status changed to published and it wasn't already set
        ...(formData.status === 'published' && !initialPost?.published_at ? { published_at: new Date().toISOString() } : {})
      };

      if (initialPost?.id) {
        // Update
        const { error } = await anySupabase
          .from("blog_posts")
          .update(postData)
          .eq("id", initialPost.id);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await anySupabase
          .from("blog_posts")
          .insert([postData]);
        
        if (error) throw error;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Post Content</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <Input 
                name="title"
                value={formData.title} 
                onChange={handleChange} 
                required 
                placeholder="Enter post title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea 
                name="excerpt"
                value={formData.excerpt} 
                onChange={handleChange} 
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="A short summary of the post..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Search Engine Optimization (SEO)</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title <span className="text-xs text-gray-400 font-normal">({formData.meta_title.length} / 60)</span>
              </label>
              <Input 
                name="meta_title"
                value={formData.meta_title} 
                onChange={handleChange} 
                placeholder="Leave blank to use post title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description <span className="text-xs text-gray-400 font-normal">({formData.meta_description.length} / 160)</span>
              </label>
              <textarea 
                name="meta_description"
                value={formData.meta_description} 
                onChange={handleChange} 
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Leave blank to use excerpt"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Area */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Publishing</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
              <Input 
                name="slug"
                value={formData.slug} 
                onChange={handleChange} 
                required 
              />
              <p className="text-xs text-gray-500 mt-1">
                The URL will be: /blog/<strong>{formData.slug || '...'}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">No Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image (1200x630px)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md overflow-hidden relative">
                {coverPreview ? (
                  <div className="absolute inset-0">
                    <Image src={coverPreview} alt="Preview" fill className="object-cover" />
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
                    <p className="text-xs text-gray-500">Auto-compressed to WebP</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving..." : "Save Post"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2" 
                onClick={() => router.push("/admin/blog")}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
