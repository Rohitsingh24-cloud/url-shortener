import { BadRequestError } from "../utils/errorHandler.js";

export const validate = (schema) => {
    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            const message = result.error.issues
                .map(issue => `${issue.path.join(".")}: ${issue.message}`)
                .join(", ");

            return next(new BadRequestError(message));
        }

        req.body = result.data;

        next();
    };
};