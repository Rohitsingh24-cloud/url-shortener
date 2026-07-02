import express from "express"
import { register_user, login_user,logout_user,get_current_user } from "../controller/auth.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { loginLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router()
router.post(
    "/register",
    validate(registerSchema),
    register_user
);

router.post(
    "/login",
    loginLimiter,
    validate(loginSchema),
    login_user
);
router.post("/logout", logout_user)
router.get("/me", authMiddleware,get_current_user)

export default router