
import Redis from "ioredis";
import config from "./app.config.js";
import logger from "./logger.config.js";

const redisClient = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,

    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    },
});

redisClient.on("connect", () => {
    logger.info("Redis Connected");
});

redisClient.on("ready", () => {
    logger.info("Redis Ready");
});

redisClient.on("error", (err) => {
    logger.error(`Redis Error: ${err.message}`);
});

export const connectRedis = async () => {
    await redisClient.ping();
};

export default redisClient;