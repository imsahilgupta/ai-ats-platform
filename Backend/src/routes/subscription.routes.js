const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const { getSubscriptionController, upgradeSubscriptionController } = require("../controllers/subscription.controller");

const router = express.Router();

router.get("/", authUser, getSubscriptionController);
router.post("/upgrade", authUser, upgradeSubscriptionController);

module.exports = router;
