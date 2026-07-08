const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");
const {
  analyzeResumeController,
  getResumeHistoryController,
} = require("../controllers/resume.controller");

const router = express.Router();

router.post(
  "/analyze",
  authUser,
  upload.single("resume"),
  analyzeResumeController,
);
router.get("/history", authUser, getResumeHistoryController);

module.exports = router;
