import { apiFetch } from "@/lib/api/client";
import { API_URL } from "@/lib/env";
import type { BlogPost, BlogPostInput, BlogPostSummary } from "@/types/blog";

export function getBlogPosts() {
  return apiFetch<{ posts: BlogPostSummary[] }>("/blog");
}

export function getBlogPostBySlug(slug: string) {
  return apiFetch<{ post: BlogPost }>(`/blog/${slug}`);
}

// Used from Server Components (blog detail page) — plain fetch with
// ISR-style revalidation instead of apiFetch's client-oriented shape.
export async function getBlogPostBySlugServer(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/blog/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.post as BlogPost;
  } catch {
    return null;
  }
}

export function getAdminBlogPosts() {
  return apiFetch<{ posts: BlogPost[] }>("/blog/admin/all");
}

export function createBlogPost(payload: BlogPostInput) {
  return apiFetch<{ message: string; post: BlogPost }>("/blog/admin", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBlogPost(id: string, payload: Partial<BlogPostInput>) {
  return apiFetch<{ message: string; post: BlogPost }>(`/blog/admin/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteBlogPost(id: string) {
  return apiFetch<{ message: string }>(`/blog/admin/${id}`, {
    method: "DELETE",
  });
}
