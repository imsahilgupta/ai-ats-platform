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

module.exports = authRouter;
