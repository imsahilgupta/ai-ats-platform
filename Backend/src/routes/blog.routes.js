const express = require("express");
const { authUser, adminOnly } = require("../middlewares/auth.middleware");
const {
  getPublishedPostsController,
  getPostBySlugController,
  getAllPostsAdminController,
  createPostController,
  updatePostController,
  deletePostController,
} = require("../controllers/blog.controller");

const router = express.Router();

// Admin CRUD (registered before "/:slug" to avoid ambiguity)
router.get("/admin/all", authUser, adminOnly, getAllPostsAdminController);
router.post("/admin", authUser, adminOnly, createPostController);
router.patch("/admin/:id", authUser, adminOnly, updatePostController);
router.delete("/admin/:id", authUser, adminOnly, deletePostController);

// Public
router.get("/", getPublishedPostsController);
router.get("/:slug", getPostBySlugController);

module.exports = router;
