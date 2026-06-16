const { Router} = require("express");
const authController = require('../controllers/auth.controller');
const { authUser } = require('../middlewares/auth.middleware');

const authRouter = Router();

/**
 * @routes POST /api/auth/register
 * @desc Register User
 * @access Public
 */

authRouter.post("/register", authController.registerUserController );

/**
 * @routes POST /api/auth/login
 * @desc login User with email and password
 * @access Public
 */

authRouter.post("/login", authController.loginUserController );

/**
 * @routes GET /api/auth/logout
 * @desc logout User and add token to blacklist
 * @access PUBLIC
 */

authRouter.get("/logout", authController.logoutUserController );


/**
 * @routes GET /api/auth/get-me
 * @desc get the current logged in user details
 * @access PRIVATE
 */

authRouter.get("/get-me", authUser, authController.getMeController );


module.exports = authRouter;