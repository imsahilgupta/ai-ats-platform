const subscriptionModel = require("../models/subscription.model");
const userModel = require("../models/user.model");
const Stripe = require("stripe");
const crypto = require("crypto");
const { sendBillingReceiptEmail } = require("../services/mail.services");

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const PLAN_DETAILS = {
  PRO: { usd: 19, npr: 2500 },
  ENTERPRISE: { usd: 49, npr: 6500 },
};

/**
 * ── Stripe Checkout Session ──
 */
async function createStripeSession(req, res) {
  try {
    const { plan } = req.body;
    if (!plan || !PLAN_DETAILS[plan]) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured on this server." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `MockMate.AI ${plan} Plan`,
              description: `Upgrade account to ${plan} tier for 30 days.`,
            },
            unit_amount: PLAN_DETAILS[plan].usd * 100, // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/subscription/success?gateway=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/#pricing`,
      metadata: {
        userId: req.user.id,
        plan,
      },
    });

    res.status(200).json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({ message: "Failed to generate Stripe checkout session", error: error.message });
  }
}

async function verifyStripeSession(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured." });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment has not been completed." });
    }

    const userId = session.metadata.userId;
    const plan = session.metadata.plan;

    if (userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized payment verification." });
    }

    const updatedSub = await subscriptionModel.findOneAndUpdate(
      { user: userId },
      {
        plan,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
        stripeCustomerId: session.customer || null,
        stripeSubscriptionId: session.id || null,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: `Successfully upgraded to ${plan}!`,
      subscription: updatedSub,
    });
  } catch (error) {
    console.error("Stripe verification error:", error);
    res.status(500).json({ message: "Verification failed.", error: error.message });
  }
}

/**
 * ── eSewa UAT integration ──
 */
async function initiateEsewaPayment(req, res) {
  try {
    const { plan } = req.body;
    if (!plan || !PLAN_DETAILS[plan]) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const totalAmount = PLAN_DETAILS[plan].npr;
    const transactionUuid = `esewa-${req.user.id}-${Date.now()}`;
    const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
    const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

    // eSewa signature message string
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(message)
      .digest("base64");

    const paymentData = {
      amount: totalAmount,
      tax_amount: 0,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/subscription/success`,
      failure_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/#pricing`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
      esewa_url: process.env.ESEWA_GATEWAY_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    };

    res.status(200).json(paymentData);
  } catch (error) {
    console.error("eSewa initiation error:", error);
    res.status(500).json({ message: "Failed to initiate eSewa payment", error: error.message });
  }
}

async function verifyEsewaPayment(req, res) {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ message: "Data payload is required" });
    }

    const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

    // 1. Decode base64 eSewa response payload
    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
    const { total_amount, transaction_uuid, product_code, signature, signed_field_names } = decoded;

    // 2. Validate response signature
    const fieldNames = signed_field_names.split(",");
    const message = fieldNames.map((field) => `${field}=${decoded[field]}`).join(",");
    
    const computedHmac = crypto
      .createHmac("sha256", secretKey)
      .update(message)
      .digest("base64");

    if (computedHmac !== signature) {
      return res.status(400).json({ message: "Cryptographic signature mismatch. Verification failed." });
    }

    // 3. Confirm transaction status via eSewa Status Check API (server-to-server)
    const checkUrl = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;
    const statusRes = await fetch(checkUrl);
    const statusData = await statusRes.json();

    if (statusData.status !== "COMPLETE") {
      return res.status(400).json({ message: `Transaction status check failed. State: ${statusData.status}` });
    }

    // Determine the plan based on the total_amount
    let plan = "FREE";
    if (parseFloat(total_amount) === PLAN_DETAILS.PRO.npr) {
      plan = "PRO";
    } else if (parseFloat(total_amount) === PLAN_DETAILS.ENTERPRISE.npr) {
      plan = "ENTERPRISE";
    }

    if (plan === "FREE") {
      return res.status(400).json({ message: "Invalid payment amount detected." });
    }

    const updatedSub = await subscriptionModel.findOneAndUpdate(
      { user: req.user.id },
      {
        plan,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      },
      { new: true, upsert: true }
    );

    const user = await userModel.findById(req.user.id);
    if (user) {
      sendBillingReceiptEmail(user.email, {
        plan,
        amountNpr: parseFloat(total_amount),
        transactionId: transaction_uuid,
        gateway: "eSewa",
        billedAt: updatedSub.startDate,
        renewsAt: updatedSub.endDate,
      }).catch((err) => console.error("Failed to send billing receipt email:", err));
    }

    res.status(200).json({
      message: `Successfully upgraded to ${plan}!`,
      subscription: updatedSub,
    });
  } catch (error) {
    console.error("eSewa verification error:", error);
    res.status(500).json({ message: "eSewa payment verification failed.", error: error.message });
  }
}

module.exports = {
  createStripeSession,
  verifyStripeSession,
  initiateEsewaPayment,
  verifyEsewaPayment,
};
