// External Module
const express = require("express");
const hostRouter = express.Router();

// Local Module
const hostController = require("../controllers/hostController");

hostRouter.get("/add-post", hostController.getAddPost);
hostRouter.post("/add-post", hostController.postAddPost);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-post/:homeId", hostController.getEditHome);
hostRouter.post("/edit-post", hostController.postEditPost);
hostRouter.get("/delete-post", hostController.getDeletePost);
hostRouter.get("/delete-post/:postId", hostController.postDeletePost);

module.exports = hostRouter;
