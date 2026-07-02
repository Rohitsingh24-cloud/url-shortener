import { Queue } from "bullmq";
import bullMQConnection from "../config/bullmq.config.js";

const clickAnalyticsQueue = new Queue("click-analytics", {
    connection: bullMQConnection,
});

export default clickAnalyticsQueue;