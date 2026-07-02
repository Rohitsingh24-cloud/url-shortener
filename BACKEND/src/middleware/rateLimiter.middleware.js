import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../config/redis.config.js";

const createRateLimiter = (points, duration) => {
    const rateLimiter = new RateLimiterRedis({
        storeClient: redisClient,

        keyPrefix: "rate-limit",

        points,

        duration,
    });

    return async (req, res, next) => {
        try {
            console.log("Client IP:", req.ip);
        
            await rateLimiter.consume(req.ip);
        
            next();
        } catch (err) {
            console.log("Rate limiter error:", err);
        
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later.",
            });
        }
    };
};

export const loginLimiter = createRateLimiter(5, 60);

export const createUrlLimiter = createRateLimiter(20, 60);

export const redirectLimiter = createRateLimiter(200, 60);