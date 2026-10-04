import { Router } from "express";
import {
    userLogin, userSignup, checkAuth, userLogout , seedAdmin
} from "../controllers/users.controllers.js";
import { authUser } from "../middlewares/users.middleware.js";

const router = Router();

//checkAuth route is used to check if the user is authenticated or not.
router.route("/checkAuth").get(checkAuth);
// userSignup route is used to create a new user. only which has role employee not admin
router.route("/userSignup").post(userSignup);
// Create initial admin
router.route("/seedAdmin").post(seedAdmin);
//both employee and admin can login using this route
router.route("/login").post(userLogin);
//both employee and admin can logout using this route
router.route("/logout").post(authUser, userLogout);


export default router;






