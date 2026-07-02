import {
    createShortUrlWithoutUser,
    createShortUrlWithUser,
    redirectToShortUrl,
} from "../services/short_url.service.js";
import { getUserUrls } from "../services/short_url.service.js";
import wrapAsync from "../utils/trycatchwrapper.js"
import { deleteUserUrl } from "../services/short_url.service.js";
import { updateUserSlug } from "../services/short_url.service.js";
export const createShortUrl = wrapAsync(async (req,res)=>{
    const data = req.body
    let shortUrl
    if(req.user){
        shortUrl = await createShortUrlWithUser(data.url,req.user._id,data.slug)
    }else{  
        shortUrl = await createShortUrlWithoutUser(data.url)
    }
    res.status(200).json({shortUrl: `${process.env.APP_URL}/${shortUrl}`})
})


export const redirectFromShortUrl = wrapAsync(async (req, res) => {
    const { id } = req.params;

    const url = await redirectToShortUrl(id);

    res.redirect(url.full_url);
});
export const createCustomShortUrl = wrapAsync(async (req,res)=>{
    const {url,slug} = req.body
    const shortUrl = await createShortUrlWithoutUser(url, slug);
    res.status(200).json({shortUrl: `${process.env.APP_URL}/${shortUrl}`})
})

export const getMyUrls = wrapAsync(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { urls, total } = await getUserUrls(
        req.user._id,
        page,
        limit
    );

    res.status(200).json({
        success: true,
        urls,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });

});
export const deleteUrl = wrapAsync(async (req, res) => {
    await deleteUserUrl(req.params.id, req.user._id);

    res.status(200).json({
        success: true,
        message: "URL deleted successfully",
    });
});
export const editSlug = wrapAsync(async (req, res) => {
    const { slug } = req.body;

    const url = await updateUserSlug(
        req.params.id,
        req.user._id,
        slug
    );

    res.status(200).json({
        success: true,
        url,
    });
});