const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const { chatAssistantController } = require("../controllers/assistant.controller");

const router = express.Router();

router.post("/chat", authUser, chatAssistantController);

module.exports = router;
