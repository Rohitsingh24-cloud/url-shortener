import "dotenv/config";

import connectDB from "./src/config/mongo.config.js";
import "./src/worker/click.worker.js";
import logger from "./src/config/logger.config.js";

const startWorker = async () => {
    try {
        await connectDB();

        logger.info("Worker process started");
    } catch (err) {
        logger.error(err);

        process.exit(1);
    }
};

startWorker();