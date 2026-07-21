"use client";

import { useState } from "react";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { BlogPostFormDialog } from "@/components/admin/blog-post-form-dialog";
import { useAdminBlogPostsQuery, useDeleteBlogPostMutation } from "@/hooks/use-blog";
import type { BlogPost } from "@/types/blog";

export default function AdminBlogPage() {
  const { data, isLoading } = useAdminBlogPostsQuery();
  const deleteMutation = useDeleteBlogPostMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const posts = data?.posts ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Blog"
        description="Create and manage public blog posts."
        action={
          <Button
            size="sm"
            onClick={() => {
              setEditingPost(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-3.5" />
            New post
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState icon={FileText} title="No posts yet" description="Create your first blog post to get started." />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{post.title}</p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {post.category}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      post.status === "published"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString()} &middot; {post.readTime} &middot; /{post.slug}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  aria-label="Edit post"
                  onClick={() => {
                    setEditingPost(post);
                    setFormOpen(true);
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  aria-label="Delete post"
                  onClick={() => setDeleteTarget(post)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BlogPostFormDialog open={formOpen} onOpenChange={setFormOpen} post={editingPost} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete post"
        description={`This will permanently delete "${deleteTarget?.title}". This action cannot be undone.`}
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
          }
        }}
      />
    </div>
  );
}
