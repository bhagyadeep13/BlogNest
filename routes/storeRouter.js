// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/postDetails", storeController.getPostDetails);
storeRouter.get("/post-list", storeController.getPostList);
storeRouter.get("/favourites", storeController.getFavouriteList);
storeRouter.post("/favourites", storeController.postAddToFavourite);
storeRouter.post("/favourites/delete/:postId", storeController.postRemoveFromFavourite);
// here this _id in link is passed as req.params._id*/

module.exports = storeRouter;
