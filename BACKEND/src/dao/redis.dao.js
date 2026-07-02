import redisClient from "../config/redis.config.js";

export const getCachedUrl = async (key) => {
    return await redisClient.get(key);
};

export const setCachedUrl = async (key, value) => {
    await redisClient.set(
        key,
        value,
        "EX",
        60 * 60 * 24
    );
};