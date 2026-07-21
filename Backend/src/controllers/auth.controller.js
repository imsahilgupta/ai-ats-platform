const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklist.model");
const {
  validatePasswordStrength,
  validateEmail,
  validateUsername,
} = require("../utils/validation");

/**
 * Secure cookie options
 */
const getCookieOptions = () => ({
  httpOnly: true,
  secure: false,
  // "strict" drops the cookie on cross-site top-level redirects — which is
  // exactly how the user returns from the eSewa/OAuth callback flows, so the
  // session would appear logged-out on the very request that needs it.
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});

/**
 * @name registerUserController
 * @desc register a new user, expects username, email & password in the required field
 * @access public
 */
async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validate username format
    if (!validateUsername(username)) {
      return res.status(400).json({
        message:
          "Username must be 3-20 characters (alphanumeric, underscore, hyphen only)",
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: "Password does not meet strength requirements",
        errors: passwordValidation.errors,
      });
    }

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "Username or Email already taken",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, getCookieOptions());

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      message: "An error occurred during registration",
    });
  }
}

/**
 * @name loginUserController
 * @desc login a user, excepts email and password in the request body
 * @access public
 */
async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      // Don't reveal if email exists
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "An error occurred during login",
    });
  }
}

/**
 * @name logoutUserController
 * @desc logout a user, expects token in the cookie and add the token to blacklist
 * @access private
 */
async function logoutUserController(req, res) {
  try {
    const token = req.cookies.token;

    if (token) {
      await blacklistTokenModel.create({ token });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({
      message: "An error occurred during logout",
    });
  }
}

/** *
 * @name getMeController
 * @desc get the current logged in user details, expects token in the cookie
 * @access private
 */
async function getMeController(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User details fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({
      message: "An error occurred fetching user details",
    });
  }
}

/**
 * @name updateUsernameController
 * @desc Update the username of the logged-in user and re-issue JWT cookie
 * @access private
 */
async function updateUsernameController(req, res) {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    if (!validateUsername(username)) {
      return res.status(400).json({
        message: "Username must be 3-20 characters (alphanumeric, underscore, hyphen only)",
      });
    }
    const existing = await userModel.findOne({ username, _id: { $ne: req.user.id } });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Re-issue JWT with updated username
    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, getCookieOptions());
    res.status(200).json({
      message: "Username updated successfully",
      user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error("Update username error:", err);
    res.status(500).json({ message: "An error occurred while updating username" });
  }
}

/**
 * @name deleteAccountController
 * @desc Delete the logged-in user account and all their interview reports
 * @access private
 */
async function deleteAccountController(req, res) {
  try {
    const interviewReportModel = require("../models/interviewReport.model");
    // Delete all reports belonging to the user
    await interviewReportModel.deleteMany({ user: req.user.id });
    // Delete the user
    await userModel.findByIdAndDelete(req.user.id);
    // Blacklist current token
    const token = req.cookies.token;
    if (token) {
      await blacklistTokenModel.create({ token });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "An error occurred while deleting account" });
  }
}

async function googleRedirectController(req, res) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || "GOOGLE_ID_PLACEHOLDER";
    const redirectUri = encodeURIComponent(
      process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
    );
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=profile%20email`;
    res.redirect(authUrl);
  } catch (err) {
    console.error("Google redirect error:", err);
    res.status(500).json({ message: "Google redirect failed" });
  }
}

async function googleCallbackController(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect((process.env.FRONTEND_URL || "http://localhost:3000") + "/login?error=no_code");
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || "GOOGLE_ID_PLACEHOLDER";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_SECRET_PLACEHOLDER";
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback";

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error("Google Token Exchange failed:", tokenData);
      return res.redirect((process.env.FRONTEND_URL || "http://localhost:3000") + "/login?error=token_exchange_failed");
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    if (!userData.email) {
      return res.redirect((process.env.FRONTEND_URL || "http://localhost:3000") + "/login?error=no_email");
    }

    let user = await userModel.findOne({ email: userData.email });
    if (!user) {
      const crypto = require("crypto");
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hash = await bcrypt.hash(randomPassword, 10);
      let baseUsername = userData.name ? userData.name.replace(/\s+/g, "").toLowerCase() : userData.email.split("@")[0];
      baseUsername = baseUsername.replace(/[^a-zA-Z0-9_-]/g, "");
      if (baseUsername.length < 3) baseUsername = "user_" + crypto.randomBytes(4).toString("hex");
      let finalUsername = baseUsername;
      let counter = 1;
      while (await userModel.findOne({ username: finalUsername })) {
        finalUsername = `${baseUsername}_${counter}`;
        counter++;
      }

      user = await userModel.create({
        username: finalUsername,
        email: userData.email,
        password: hash,
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, getCookieOptions());
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000/");
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.redirect((process.env.FRONTEND_URL || "http://localhost:3000") + "/login?error=server_error");
  }
}

async function githubRedirectController(req, res) {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID || "GITHUB_ID_PLACEHOLDER";
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
    res.redirect(authUrl);
  } catch (err) {
    console.error("GitHub redirect error:", err);
    res.status(500).json({ message: "GitHub redirect failed" });
  }
}

async function githubCallbackController(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect((process.env.FRONTEND_URL || "http://localhost:3000") + "/login?error=no_code");
    }

    const clientId = process.env.GITHUB_CLIENT_ID || "GITHUB_ID_PLACEHOLDER";
    const clientSecret = process.env.GITHUB_CLIENT_SECRET || "GITHUB_SECRET_PLACEHOLDER";

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error("GitHub Token Exchange failed:", tokenData);
      return res.redirect((process.env.FRONTEND_URL || "http://localhost:3000") + "/login?error=token_exchange_failed");
    }

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${tokenData.access_token}`,
        "User-Agent": "MockMate-App",
      },
    });
    const userData = await userRes.json();

    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${tokenData.access_token}`,
        "User-Agent": "MockMate-App",
      },
    });
    const emailsData = await emailsRes.json();
    const primaryEmail = Array.isArray(emailsData)
      ? emailsData.find((e) => e.primary)?.email || emailsData[0]?.email
      : userData.email;

    if (!primaryEmail) {
      return res.redirect((process.env.FRONTEND_URL || "http://localhost:3000") + "/login?error=no_email");
    }

    let user = await userModel.findOne({ email: primaryEmail });
    if (!user) {
      const crypto = require("crypto");
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hash = await bcrypt.hash(randomPassword, 10);
      let baseUsername = userData.login ? userData.login.replace(/\s+/g, "").toLowerCase() : primaryEmail.split("@")[0];
      baseUsername = baseUsername.replace(/[^a-zA-Z0-9_-]/g, "");
      if (baseUsername.length < 3) baseUsername = "user_" + crypto.randomBytes(4).toString("hex");
      let finalUsername = baseUsername;
      let counter = 1;
      while (await userModel.findOne({ username: finalUsername })) {
        finalUsername = `${baseUsername}_${counter}`;
        counter++;
      }

      user = await userModel.create({
        username: finalUsername,
        email: primaryEmail,
        password: hash,
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, getCookieOptions());
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000/");
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    res.redirect((process.env.FRONTEND_URL || "http://localhost:3000") + "/login?error=server_error");
  }
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  updateUsernameController,
  deleteAccountController,
  googleRedirectController,
  googleCallbackController,
  githubRedirectController,
  githubCallbackController,
};

