import { incrementClicks } from "../dao/short_url.js";

export const processClick = async (shortUrl) => {
    await incrementClicks(shortUrl);
};