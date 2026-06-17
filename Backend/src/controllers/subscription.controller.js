const subscriptionModel = require("../models/subscription.model");

async function getSubscriptionController(req, res) {
    try {
        let sub = await subscriptionModel.findOne({ user: req.user.id });
        if (!sub) {
            sub = await subscriptionModel.create({ user: req.user.id, plan: "FREE" });
        }
        res.status(200).json({ subscription: sub });
    } catch (error) {
        console.error("Get subscription error:", error);
        res.status(500).json({ message: "Failed to fetch subscription.", error: error.message });
    }
}

async function upgradeSubscriptionController(req, res) {
    try {
        const { plan } = req.body;
        if (!plan || !["FREE", "PRO", "ENTERPRISE"].includes(plan)) {
            return res.status(400).json({ message: "Invalid plan tier selected." });
        }

        // Mock payment integration hook - instantly approves mock purchase
        const sub = await subscriptionModel.findOneAndUpdate(
            { user: req.user.id },
            {
                plan,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                isActive: true
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: `Subscription successfully updated to ${plan}!`,
            subscription: sub
        });
    } catch (error) {
        console.error("Upgrade subscription error:", error);
        res.status(500).json({ message: "Failed to upgrade subscription.", error: error.message });
    }
}

module.exports = {
    getSubscriptionController,
    upgradeSubscriptionController
};
