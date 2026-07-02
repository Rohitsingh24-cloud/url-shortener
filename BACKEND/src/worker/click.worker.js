import { Worker } from "bullmq";
import bullMQConnection from "../config/bullmq.config.js";
import { processClick } from "../services/click.service.js";
import logger from "../config/logger.config.js";

const clickWorker = new Worker(
    "click-analytics",
    async (job) => {
        const { shortUrl } = job.data;

        await processClick(shortUrl);

        logger.info(`Clicks updated for ${shortUrl}`);
    },
    {
        connection: bullMQConnection,
    }
);

clickWorker.on("ready", () => {
    logger.info("Click Worker is ready");
});

clickWorker.on("completed", (job) => {
    logger.info(`Job ${job.id} completed`);
});

clickWorker.on("failed", (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message}`);
});

export default clickWorker;