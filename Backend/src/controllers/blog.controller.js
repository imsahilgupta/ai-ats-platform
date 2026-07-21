const postModel = require("../models/post.model");

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function computeReadTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function serializePost(post, includeContent) {
  return {
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    author: post.author,
    status: post.status,
    publishedAt: post.publishedAt,
    readTime: computeReadTime(post.content),
    ...(includeContent ? { content: post.content } : {}),
  };
}

/**
 * Public: list published posts, newest first (list view — no content body).
 */
async function getPublishedPostsController(req, res) {
  try {
    const posts = await postModel
      .find({ status: "published" })
      .sort({ publishedAt: -1 });

    res.status(200).json({ posts: posts.map((p) => serializePost(p, false)) });
  } catch (error) {
    console.error("Get published posts error:", error);
    res.status(500).json({ message: "Failed to fetch posts.", error: error.message });
  }
}

/**
 * Public: fetch a single published post by slug (full content).
 */
async function getPostBySlugController(req, res) {
  try {
    const post = await postModel.findOne({ slug: req.params.slug, status: "published" });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({ post: serializePost(post, true) });
  } catch (error) {
    console.error("Get post by slug error:", error);
    res.status(500).json({ message: "Failed to fetch post.", error: error.message });
  }
}

/**
 * Admin-only: list every post (draft + published).
 */
async function getAllPostsAdminController(req, res) {
  try {
    const posts = await postModel.find().sort({ updatedAt: -1 });
    res.status(200).json({ posts: posts.map((p) => serializePost(p, true)) });
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ message: "Failed to fetch posts.", error: error.message });
  }
}

/**
 * Admin-only: create a post. Slug is derived from the title if not provided.
 */
async function createPostController(req, res) {
  try {
    const { title, excerpt, category, content, author, status, slug } = req.body;

    if (!title || !excerpt || !category || !content) {
      return res.status(400).json({ message: "title, excerpt, category, and content are required." });
    }

    const finalSlug = slug ? slugify(slug) : slugify(title);
    const existing = await postModel.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(409).json({ message: "A post with this slug already exists." });
    }

    const post = await postModel.create({
      title,
      slug: finalSlug,
      excerpt,
      category,
      content,
      author: author || "MockMate Team",
      status: status === "draft" ? "draft" : "published",
    });

    res.status(201).json({ message: "Post created.", post: serializePost(post, true) });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Failed to create post.", error: error.message });
  }
}

/**
 * Admin-only: update a post.
 */
async function updatePostController(req, res) {
  try {
    const { title, excerpt, category, content, author, status, slug } = req.body;
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (slug && slugify(slug) !== post.slug) {
      const finalSlug = slugify(slug);
      const existing = await postModel.findOne({ slug: finalSlug, _id: { $ne: post._id } });
      if (existing) {
        return res.status(409).json({ message: "A post with this slug already exists." });
      }
      post.slug = finalSlug;
    }

    if (title) post.title = title;
    if (excerpt) post.excerpt = excerpt;
    if (category) post.category = category;
    if (content) post.content = content;
    if (author) post.author = author;
    if (status === "draft" || status === "published") post.status = status;

    await post.save();
    res.status(200).json({ message: "Post updated.", post: serializePost(post, true) });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Failed to update post.", error: error.message });
  }
}

/**
 * Admin-only: delete a post.
 */
async function deletePostController(req, res) {
  try {
    const post = await postModel.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({ message: "Post deleted." });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Failed to delete post.", error: error.message });
  }
}

module.exports = {
  getPublishedPostsController,
  getPostBySlugController,
  getAllPostsAdminController,
  createPostController,
  updatePostController,
  deletePostController,
};
