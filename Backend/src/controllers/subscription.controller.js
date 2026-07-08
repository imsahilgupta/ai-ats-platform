const subscriptionModel = require("../models/subscription.model");
const Stripe = require("stripe");

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })
  : null;

async function getSubscriptionController(req, res) {
  try {
    let sub = await subscriptionModel.findOne({ user: req.user.id });
    if (!sub) {
      sub = await subscriptionModel.create({ user: req.user.id, plan: "FREE" });
    }
    res.status(200).json({ subscription: sub });
  } catch (error) {
    console.error("Get subscription error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch subscription.", error: error.message });
  }
}

async function upgradeSubscriptionController(req, res) {
  try {
    const { plan } = req.body;
    if (!plan || !["FREE", "PRO", "ENTERPRISE"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan tier selected." });
    }

    let sub = await subscriptionModel.findOne({ user: req.user.id });
    if (!sub) {
      sub = await subscriptionModel.create({ user: req.user.id, plan: "FREE" });
    }

    if (plan === "PRO" && stripe) {
      const customer =
        sub.stripeCustomerId ||
        (await stripe.customers.create({
          email: req.user.email || "user@example.com",
          name: req.user.name || "User",
        }));
      if (!sub.stripeCustomerId) {
        sub.stripeCustomerId = customer.id;
      }
      await sub.save();
    }

    sub = await subscriptionModel.findOneAndUpdate(
      { user: req.user.id },
      {
        plan,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        stripeCustomerId: sub.stripeCustomerId,
        stripeSubscriptionId: sub.stripeSubscriptionId,
      },
      { new: true, upsert: true },
    );

    res.status(200).json({
      message: `Subscription successfully updated to ${plan}!`,
      subscription: sub,
    });
  } catch (error) {
    console.error("Upgrade subscription error:", error);
    res.status(500).json({
      message: "Failed to upgrade subscription.",
      error: error.message,
    });
  }
}

module.exports = {
  getSubscriptionController,
  upgradeSubscriptionController,
};
