import mongoose from "mongoose";
import config from "./app.config.js";
import logger from "./logger.config.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGO_URL);

        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;