const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const {
  createStripeSession,
  verifyStripeSession,
  initiateEsewaPayment,
  verifyEsewaPayment,
} = require("../controllers/payment.controller");

const router = express.Router();

router.post("/stripe/session", authUser, createStripeSession);
router.post("/stripe/verify", authUser, verifyStripeSession);
router.post("/esewa/initiate", authUser, initiateEsewaPayment);
router.post("/esewa/verify", authUser, verifyEsewaPayment);

module.exports = router;
