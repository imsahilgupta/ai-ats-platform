const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");

const authRouter = Router();

/**
 * @routes POST /api/auth/register
 * @desc Register User
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @routes POST /api/auth/verify-email
 * @desc Verify a registration code and log the user in
 * @access Public
 */
authRouter.post("/verify-email", authController.verifyEmailController);

/**
 * @routes POST /api/auth/resend-verification
 * @desc Resend the email verification code
 * @access Public
 */
authRouter.post("/resend-verification", authController.resendVerificationController);

/**
 * @routes POST /api/auth/forgot-password
 * @desc Email a password reset code
 * @access Public
 */
authRouter.post("/forgot-password", authController.forgotPasswordController);

/**
 * @routes POST /api/auth/reset-password
 * @desc Reset a password using an emailed code
 * @access Public
 */
authRouter.post("/reset-password", authController.resetPasswordController);

/**
 * @routes POST /api/auth/login
 * @desc login User with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @routes GET /api/auth/logout
 * @desc logout User and add token to blacklist
 * @access PRIVATE
 */
authRouter.get("/logout", authUser, authController.logoutUserController);

/**
 * @routes GET /api/auth/get-me
 * @desc get the current logged in user details
 * @access PRIVATE
 */
authRouter.get("/get-me", authUser, authController.getMeController);

/**
 * @routes PATCH /api/auth/update-username
 * @desc Update the username of the logged-in user
 * @access PRIVATE
 */
authRouter.patch("/update-username", authUser, authController.updateUsernameController);

/**
 * @routes DELETE /api/auth/delete-account
 * @desc Delete the logged-in user account and all their data
 * @access PRIVATE
 */
authRouter.delete("/delete-account", authUser, authController.deleteAccountController);

/**
 * @routes GET /api/auth/google
 * @desc Redirect to Google consent screen
 * @access Public
 */
authRouter.get("/google", authController.googleRedirectController);

/**
 * @routes GET /api/auth/google/callback
 * @desc Handle Google OAuth callback
 * @access Public
 */
authRouter.get("/google/callback", authController.googleCallbackController);

/**
 * @routes GET /api/auth/github
 * @desc Redirect to GitHub consent screen
 * @access Public
 */
authRouter.get("/github", authController.githubRedirectController);

/**
 * @routes GET /api/auth/github/callback
 * @desc Handle GitHub OAuth callback
 * @access Public
 */
authRouter.get("/github/callback", authController.githubCallbackController);

module.exports = authRouter;
