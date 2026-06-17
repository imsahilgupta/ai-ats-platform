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
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "An error occurred while deleting account" });
  }
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  updateUsernameController,
  deleteAccountController,
};
