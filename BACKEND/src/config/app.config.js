
const config = {
    PORT: Number(process.env.PORT) || 3000,

    NODE_ENV: process.env.NODE_ENV || "development",

    APP_URL: process.env.APP_URL,

    CLIENT_URL: process.env.CLIENT_URL,

    MONGO_URL: process.env.MONGO_URL,
    REDIS_URL: process.env.REDIS_URL,

    JWT_SECRET: process.env.JWT_SECRET,

    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "5m",
};
export default config;