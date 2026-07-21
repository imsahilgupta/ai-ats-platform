"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateBlogPostMutation, useUpdateBlogPostMutation } from "@/hooks/use-blog";
import type { BlogPost, PostStatus } from "@/types/blog";

const DEFAULT_CATEGORIES = ["Interview Tips", "Resume Advice", "Career Growth", "Product Updates"];

export function BlogPostFormDialog({
  open,
  onOpenChange,
  post,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: BlogPost | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{post ? "Edit post" : "New post"}</DialogTitle>
          <DialogDescription>
            {post ? "Update this blog post." : "Publish a new article to the public blog."}
          </DialogDescription>
        </DialogHeader>
        {/* Keyed remount (rather than an effect) resets the form fields whenever
            the dialog reopens for a different post or a fresh "new" post. */}
        {open && <BlogPostFormBody key={post?.id ?? "new"} post={post} onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

function BlogPostFormBody({
  post,
  onOpenChange,
}: {
  post?: BlogPost | null;
  onOpenChange: (open: boolean) => void;
}) {
  const isEdit = !!post;
  const createMutation = useCreateBlogPostMutation();
  const updateMutation = useUpdateBlogPostMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const [title, setTitle] = useState(post?.title ?? "");
  const [category, setCategory] = useState(post?.category ?? DEFAULT_CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "published");

  const handleSubmit = () => {
    if (!title.trim() || !excerpt.trim() || !content.trim()) return;

    if (isEdit && post) {
      updateMutation.mutate(
        { id: post.id, payload: { title, category, excerpt, content, status } },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(
        { title, category, excerpt, content, status },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  };

  return (
    <>
      <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
        <div>
          <Label htmlFor="post-title" className="mb-1.5">
            Title
          </Label>
          <Input id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1.5">Category</Label>
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5">Status</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v as PostStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="post-excerpt" className="mb-1.5">
            Excerpt
          </Label>
          <Textarea
            id="post-excerpt"
            className="min-h-16"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="post-content" className="mb-1.5">
            Content (Markdown supported)
          </Label>
          <Textarea
            id="post-content"
            className="min-h-48 font-mono text-xs"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={mutation.isPending || !title.trim() || !excerpt.trim() || !content.trim()}
        >
          {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Save changes" : "Publish post"}
        </Button>
      </DialogFooter>
    </>
  );
}
