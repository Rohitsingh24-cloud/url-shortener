import config from "../config/app.config.js";
import logger from "../config/logger.config.js";
export const errorHandler=(err,req,res,next) =>{
    if (err instanceof AppError) {

        logger.warn({
            message: err.message,
            status: err.statusCode,
            path: req.originalUrl,
            method: req.method
        });

        return res.status(err.statusCode).json({
            success:false,
            message:err.message
        });
    }
    logger.error({
        status:500,
        message: err.message,
        stack: err.stack,
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
    });
    res.status(500).json({
        success:false,
        message:
            config.NODE_ENV === "development"
                ? err.message
                : "Internal Server Error",
    });
};

export class AppError extends Error{
    statusCode;
    isOperational;
    constructor(message,statusCode=500,isOperational=true){
        super(message);
        this.statusCode=statusCode,
        this.isOperational=isOperational,
        Error.captureStackTrace(this,this.constructor);
    }
}
export class NotFoundError extends AppError{
    constructor(message="resource not found"){
        super(message,404);
    }
}
export class ConflictError extends AppError{
    constructor(message="conflict occured"){
        super(message,409);
    }
}
export class BadRequestError extends AppError{
    constructor(message="Bad request"){
        super(message,400);
    }
}
export class UnauthorizedError extends AppError{
    constructor(message="Unauthorized"){
        super(message,401);
    }
}