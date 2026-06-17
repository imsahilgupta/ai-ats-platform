const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");
const { analyzeResumeController, analyzeLinkedinController } = require("../controllers/resume.controller");

const router = express.Router();

router.post("/analyze", authUser, upload.single("resume"), analyzeResumeController);
router.post("/linkedin", authUser, analyzeLinkedinController);

module.exports = router;
