const express = require("express");
const { authUser, adminOnly } = require("../middlewares/auth.middleware");
const {
  getAnalyticsController,
  getAdminStatsController,
} = require("../controllers/analytics.controller");

const router = express.Router();

// User analytics (any logged-in user)
router.get("/", authUser, getAnalyticsController);

// Admin-only system stats endpoint
router.get("/admin/stats", authUser, adminOnly, getAdminStatsController);

module.exports = router;
