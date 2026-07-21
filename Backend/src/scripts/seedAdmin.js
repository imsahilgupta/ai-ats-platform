/**
 * Admin Seeder Script
 * ───────────────────
 * Run this ONCE to create the admin user in MongoDB.
 *
 * Usage:
 *   cd Backend
 *   node src/scripts/seedAdmin.js
 *
 * Credentials (change before production!):
 *   Email:    admin@mockmate.ai
 *   Password: Admin@MockMate2025
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ADMIN_CREDENTIALS = {
  username: "admin",
  email: "admin@mockmate.ai",
  password: "Admin@MockMate2025",
  isAdmin: true,
};

async function seed() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌  MONGODB_URI or MONGO_URI not found in .env — aborting.");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("✅  Connected to MongoDB.");

  // Lazy-load model AFTER mongoose connection is ready
  const userModel = require("../models/user.model");

  const existing = await userModel.findOne({ email: ADMIN_CREDENTIALS.email });
  if (existing) {
    let changed = false;
    if (!existing.isAdmin) {
      existing.isAdmin = true;
      changed = true;
    }
    if (!existing.isVerified) {
      // Seeded accounts bypass the emailed verification code entirely.
      existing.isVerified = true;
      changed = true;
    }
    if (changed) {
      await existing.save();
      console.log(`✅  Existing user '${existing.email}' upgraded to a verified admin.`);
    } else {
      console.log(`ℹ️   Admin user '${existing.email}' already exists. Nothing to do.`);
    }
    await mongoose.disconnect();
    return;
  }

  const hash = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);
  await userModel.create({
    username: ADMIN_CREDENTIALS.username,
    email: ADMIN_CREDENTIALS.email,
    password: hash,
    isAdmin: true,
    isVerified: true,
  });

  console.log("✅  Admin user created successfully!");
  console.log("─────────────────────────────────────");
  console.log(`   Email    : ${ADMIN_CREDENTIALS.email}`);
  console.log(`   Password : ${ADMIN_CREDENTIALS.password}`);
  console.log(`   Username : ${ADMIN_CREDENTIALS.username}`);
  console.log("─────────────────────────────────────");
  console.log("⚠️   Change these credentials before deploying to production!");

  await mongoose.disconnect();
  console.log("✅  Done.");
}

seed().catch((err) => {
  console.error("❌  Seeder failed:", err.message);
  process.exit(1);
});
