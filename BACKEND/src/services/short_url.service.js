import { getCachedUrl, setCachedUrl } from "../dao/redis.dao.js";
import clickAnalyticsQueue from "../queue/clickAnalytics.queue.js";
import { generateNanoId } from "../utils/helper.js";
import { getUrlsByUser } from "../dao/short_url.js";
import { deleteUrlById } from "../dao/short_url.js";
import { updateSlug } from "../dao/short_url.js";
import {
    getCustomShortUrl,
    saveShortUrl,
    findShortUrl,
    incrementClicks,
} from "../dao/short_url.js";

const clickJobOptions = {
    attempts: 3,
    backoff: {
        type: "exponential",
        delay: 1000,
    },
    removeOnComplete: 1000,
    removeOnFail: 5000,
};
export const createShortUrlWithoutUser = async (url) => {
    const shortUrl = generateNanoId(7)
    if(!shortUrl) throw new Error("Short URL not generated")
    await saveShortUrl(shortUrl,url)
    return shortUrl
}

export const createShortUrlWithUser = async (url,userId,slug=null) => {
    const shortUrl = slug || generateNanoId(7)
    const exists = await getCustomShortUrl(slug)
    if(exists) throw new Error("This custom url already exists")

    await saveShortUrl(shortUrl,url,userId)
    return shortUrl
}

export const redirectToShortUrl = async (shortUrl) => {

    const cachedUrl = await getCachedUrl(shortUrl);

    if (cachedUrl) {

        await clickAnalyticsQueue.add(
            "increment-click",
            {
                shortUrl,
            },
            clickJobOptions
        );

        return {
            full_url: cachedUrl,
        };
    }

    const url = await findShortUrl(shortUrl);

    if (!url) {
        throw new Error("Short URL not found");
    }

    await setCachedUrl(shortUrl, url.full_url);

    await clickAnalyticsQueue.add(
        "increment-click",
        {
            shortUrl,
        },
        clickJobOptions
    );

    return url;
};
export const getUserUrls = async (
    userId,
    page = 1,
    limit = 10
) => {
    return await getUrlsByUser(userId, page, limit);
};
export const deleteUserUrl = async (id, userId) => {
    const deletedUrl = await deleteUrlById(id, userId);

    if (!deletedUrl) {
        throw new Error("URL not found");
    }

    return deletedUrl;
};
export const updateUserSlug = async (id, userId, slug) => {
    const exists = await getCustomShortUrl(slug);

    if (exists && exists._id.toString() !== id) {
        throw new Error("Slug already exists");
    }

    const updatedUrl = await updateSlug(id, userId, slug);

    if (!updatedUrl) {
        throw new Error("URL not found");
    }

    return updatedUrl;
};