import express from 'express';
import "dotenv/config";
import {nanoid} from "nanoid";
import urlSchema from "./src/models/short_url.model.js"
import connectDB from "./src/config/mongo.config.js";
import short_url from './src/routes/short_url.route.js';
import { redirectFromShortUrl } from './src/controller/short_url.controller.js';
import { errorHandler } from './src/utils/errorHandler.js';
import cors from "cors";
import auth_routes from "./src/routes/auth.routes.js"
import user_routes from "./src/routes/user.routes.js"
import { attachUser } from './src/utils/attachUser.js';
import cookieParser from 'cookie-parser';
import config from './src/config/app.config.js';
import healthRoutes from "./src/routes/health.routes.js";
const app=express();
import requestLogger from './src/middleware/requestLogger.middleware.js';
import { connectRedis } from "./src/config/redis.config.js";
import { getCachedUrl, setCachedUrl } from "./src/dao/redis.dao.js";
import { redirectLimiter } from "./src/middleware/rateLimiter.middleware.js";
app.set("trust proxy", 1);
app.use(cors({
    origin: config.CLIENT_URL, 
    credentials: true 
}));
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(attachUser)
app.use("/health", healthRoutes);
app.use("/api/user",user_routes);
app.use("/api/auth",auth_routes);

app.use("/api/create",short_url);

app.get("/:id",redirectLimiter,redirectFromShortUrl);
app.use(errorHandler);

app.listen(config.PORT, async () => {
    await connectDB();
    await connectRedis();

    console.log(`Server is running on port ${config.PORT}`);
});
