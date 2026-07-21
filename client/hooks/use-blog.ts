import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBlogPost,
  deleteBlogPost,
  getAdminBlogPosts,
  getBlogPosts,
  updateBlogPost,
} from "@/lib/api/blog";
import { qk } from "@/lib/query/keys";
import { ApiError } from "@/types/api";
import type { BlogPostInput } from "@/types/blog";

export function useBlogPostsQuery() {
  return useQuery({
    queryKey: qk.blogPosts(),
    queryFn: getBlogPosts,
  });
}

export function useAdminBlogPostsQuery() {
  return useQuery({
    queryKey: qk.adminBlogPosts(),
    queryFn: getAdminBlogPosts,
  });
}

export function useCreateBlogPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.adminBlogPosts() });
      queryClient.invalidateQueries({ queryKey: qk.blogPosts() });
      toast.success("Post created");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.body.message : "Failed to create post."),
  });
}

export function useUpdateBlogPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BlogPostInput> }) => updateBlogPost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.adminBlogPosts() });
      queryClient.invalidateQueries({ queryKey: qk.blogPosts() });
      toast.success("Post updated");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.body.message : "Failed to update post."),
  });
}

export function useDeleteBlogPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.adminBlogPosts() });
      queryClient.invalidateQueries({ queryKey: qk.blogPosts() });
      toast.success("Post deleted");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.body.message : "Failed to delete post."),
  });
}
