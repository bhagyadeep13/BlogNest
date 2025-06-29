// External Module
const express = require("express");
const hostRouter = express.Router();
const upload = require("../utils/upload");
// Local Module
const hostController = require("../controllers/hostController");

hostRouter.get("/add-post", hostController.getAddPost);
hostRouter.post("/add-post", upload.single('photo'), hostController.postAddPost);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-post/:homeId", hostController.getEditHome);
hostRouter.post("/edit-post",upload.single('photo'), hostController.postEditPost);
hostRouter.get("/delete-post", hostController.getDeletePost);
hostRouter.post("/delete-post", hostController.postDeletePost);

module.exports = hostRouter;
