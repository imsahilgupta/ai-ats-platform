const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const { getAnalyticsController } = require("../controllers/analytics.controller");

const router = express.Router();

router.get("/", authUser, getAnalyticsController);

module.exports = router;
