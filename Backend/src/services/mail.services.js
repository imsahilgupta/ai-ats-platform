const notificationModel = require("../models/notification.model");

/**
 * Mock email service to send career updates and system reminders
 */
async function sendEmailNotification({ userId, toEmail, subject, text, type = "system" }) {
    console.log(`[MAIL SERVICE] Sending Email to ${toEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log(`-----------------------------------------`);

    try {
        const notif = await notificationModel.create({
            user: userId,
            type,
            message: `[${subject}] ${text}`,
            emailSent: true,
            scheduledFor: new Date()
        });
        return notif;
    } catch (err) {
        console.error("Failed to create notification log:", err);
        throw err;
    }
}

module.exports = {
    sendEmailNotification
};
