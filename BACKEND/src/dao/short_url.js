import urlSchema from "../models/short_url.model.js";
import { ConflictError } from "../utils/errorHandler.js";

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
    try{
        const newUrl = new urlSchema({
            full_url:longUrl,
            short_url:shortUrl
        })
        if(userId){
            newUrl.user = userId
        }
        await newUrl.save()
    }catch(err){
        if(err.code == 11000){
            throw new ConflictError("Short URL already exists")
        }
        throw new Error(err)
    }
};

export const findShortUrl = async (shortUrl) => {
    return await urlSchema.findOne({
        short_url: shortUrl,
    });
};
export const incrementClicks = async (shortUrl) => {
    return await urlSchema.updateOne(
        {
            short_url: shortUrl,
        },
        {
            $inc: {
                clicks: 1,
            },
        }
    );
};
export const getCustomShortUrl = async (slug) => {
    return await urlSchema.findOne({short_url:slug});
}
export const getUrlsByUser = async (userId, page, limit) => {

    const skip = (page - 1) * limit;

    const urls = await urlSchema
        .find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await urlSchema.countDocuments({
        user: userId,
    });

    return {
        urls,
        total,
    };
};
export const deleteUrlById = async (id, userId) => {
    return await urlSchema.findOneAndDelete({
        _id: id,
        user: userId,
    });
};
export const updateSlug = async (id, userId, slug) => {
    return await urlSchema.findOneAndUpdate(
        {
            _id: id,
            user: userId,
        },
        {
            short_url: slug,
        },
        {
            new: true,
        }
    );
};