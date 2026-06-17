const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const { startSessionController, submitAnswerController, getResultController } = require("../controllers/mockInterview.controller");

const router = express.Router();

router.post("/start", authUser, startSessionController);
router.post("/answer", authUser, submitAnswerController);
router.get("/result/:id", authUser, getResultController);

module.exports = router;
