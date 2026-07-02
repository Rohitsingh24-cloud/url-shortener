import config from "./app.config.js";

const bullMQConnection = {
    url: config.REDIS_URL,
};

export default bullMQConnection;