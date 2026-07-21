const bcrypt = require("bcryptjs");

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

async function hashOtp(code) {
  return bcrypt.hash(code, 10);
}

function otpExpiry() {
  return new Date(Date.now() + OTP_TTL_MS);
}

async function verifyOtp(code, hash, expiresAt) {
  if (!code || !hash || !expiresAt) return false;
  if (new Date(expiresAt).getTime() < Date.now()) return false;
  return bcrypt.compare(code, hash);
}

module.exports = { generateOtp, hashOtp, otpExpiry, verifyOtp };
