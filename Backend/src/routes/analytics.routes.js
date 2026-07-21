const express = require("express");
const { authUser, adminOnly } = require("../middlewares/auth.middleware");
const {
  getAnalyticsController,
  getAdminStatsController,
  getPublicStatsController,
} = require("../controllers/analytics.controller");

const router = express.Router();

// Public: safe aggregate counts for the marketing site (no auth)
router.get("/public", getPublicStatsController);

// User analytics (any logged-in user)
router.get("/", authUser, getAnalyticsController);

// Admin-only system stats endpoint
router.get("/admin/stats", authUser, adminOnly, getAdminStatsController);

module.exports = router;
