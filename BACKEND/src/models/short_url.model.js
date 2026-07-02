import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema(
    {
        full_url: {
            type: String,
            required: true,
            trim: true,
        },

        short_url: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        clicks: {
            type: Number,
            default: 0,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;