import { createClient } from "./server";
import { Database } from "@/types/database";

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Module = Database["public"]["Tables"]["modules"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];

export type CategoryWithChildren = Category & {
  children?: Category[];
};

export async function getGlobalSettings() {
  const supabase = await createClient();
  const anySupabase = supabase as any;
  const { data } = await anySupabase
    .from("site_settings")
    .select("value")
    .eq("key", "global")
    .single();
    
  return data?.value || {
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
      { id: "5", label: "Blog", url: "/blog", type: "link" },
      { id: "4", label: "Contact", url: "/contact", type: "link" }
    ]
  };
}

export async function getCategories(): Promise<CategoryWithChildren[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  
  const typedData = data as unknown as Category[];

  const topLevel = typedData.filter((c) => !c.parent_id);
  const result = topLevel.map((parent) => ({
    ...parent,
    children: typedData.filter((c) => c.parent_id === parent.id),
  }));

  return result;
}

export async function getPublishedCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published");

  if (error || !data) return [];
  return data as unknown as Course[];
}

export async function getCoursesByCategory(categorySlug: string): Promise<Course[]> {
  const supabase = await createClient();
  
  // First, find the category and its children
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, parent_id");
    
  if (!categories) return [];
  
  const typedCategories = categories as unknown as Category[];
  
  const targetCategory = typedCategories.find((c) => c.slug === categorySlug);
  if (!targetCategory) return [];

  const categoryIds = [targetCategory.id];
  const children = typedCategories.filter((c) => c.parent_id === targetCategory.id);
  children.forEach(c => categoryIds.push(c.id));

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .in("category_id", categoryIds);

  if (error || !courses) return [];
  return courses as unknown as Course[];
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  return data as unknown as Course;
}

export type ModuleWithLessons = Module & { lessons: Lesson[] };

export async function getCourseCurriculum(courseId: string): Promise<ModuleWithLessons[]> {
  const supabase = await createClient();
  
  const { data: modules, error: modError } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  if (modError || !modules) return [];
  
  const typedModules = modules as unknown as Module[];

  const moduleIds = typedModules.map(m => m.id);
  
  const { data: lessons, error: lessError } = await supabase
    .from("lessons")
    .select("*")
    .in("module_id", moduleIds)
    .order("sort_order", { ascending: true });
    
  if (lessError || !lessons) return [];
  
  const typedLessons = lessons as unknown as Lesson[];

  return typedModules.map(m => ({
    ...m,
    lessons: typedLessons.filter(l => l.module_id === m.id)
  }));
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileData as unknown as Profile;

  return {
    ...user,
    profile,
  };
}

// Blog Queries
export async function getPublishedBlogPosts() {
  const supabase = await createClient();
  const anySupabase = supabase as any;
  const { data, error } = await anySupabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image_url, published_at, blog_categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();
  const anySupabase = supabase as any;
  const { data, error } = await anySupabase
    .from("blog_posts")
    .select("*, blog_categories(name)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  return data;
}
