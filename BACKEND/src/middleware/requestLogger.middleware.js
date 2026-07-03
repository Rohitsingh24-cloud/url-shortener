import logger from "../config/logger.config.js";
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        logger.info({
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            duration: `${Date.now() - start} ms`,
            ip: req.ip
        });
    });
    next();
};

export default requestLogger;