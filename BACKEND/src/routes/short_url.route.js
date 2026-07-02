import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    createShortUrl,
    getMyUrls,
    deleteUrl,
    editSlug
} from "../controller/short_url.controller.js";
import { createUrlLimiter } from "../middleware/rateLimiter.middleware.js";
const router=express.Router();

router.post(
    "/",
    createUrlLimiter,
    createShortUrl
);
router.get(
    "/",
    authMiddleware,
    getMyUrls
);
router.delete(
    "/:id",
    authMiddleware,
    deleteUrl
);
router.patch(
    "/:id",
    authMiddleware,
    editSlug
);
export default router;