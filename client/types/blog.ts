export type PostStatus = "draft" | "published";

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  status: PostStatus;
  publishedAt: string;
  readTime: string;
}

export interface BlogPost extends BlogPostSummary {
  content: string;
}

export interface BlogPostInput {
  title: string;
  slug?: string;
  excerpt: string;
  category: string;
  content: string;
  author?: string;
  status?: PostStatus;
}
