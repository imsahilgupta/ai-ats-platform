const express = require("express");
const { authUser, adminOnly } = require("../middlewares/auth.middleware");
const {
  getUsersController,
  getSubscriptionsController,
  getReportsController,
  getGrowthController,
  getDatabaseController,
  getSystemController,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/users", authUser, adminOnly, getUsersController);
router.get("/subscriptions", authUser, adminOnly, getSubscriptionsController);
router.get("/reports", authUser, adminOnly, getReportsController);
router.get("/growth", authUser, adminOnly, getGrowthController);
router.get("/database", authUser, adminOnly, getDatabaseController);
router.get("/system", authUser, adminOnly, getSystemController);

module.exports = router;
