import Redis from "ioredis";
import config from "./app.config.js";
import logger from "./logger.config.js";

const redisClient = new Redis(config.REDIS_URL);

redisClient.on("connect", () => {
    logger.info("Redis Connected");
});

redisClient.on("error", (err) => {
    logger.error(`Redis Error: ${err.message}`);
});

export const connectRedis = async () => {
    await redisClient.ping();
};

export default redisClient;