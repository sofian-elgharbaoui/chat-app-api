const express = require("express");
const postsRouter = express.Router();

const upload = require("../helpers/upload");
const authMiddleware = require("../middlewares/auth");
const {
  getPost,
  getFeedPosts,
  getUserPosts,
  createPost,
  likePost,
  commentOnPost,
} = require("../controllers/posts");

postsRouter
  .route("/")
  .get(authMiddleware, getFeedPosts)
  .post(authMiddleware, upload.single("postPicture"), createPost);

postsRouter.get("/profile", authMiddleware, getUserPosts);
postsRouter.get("/:postId", authMiddleware, getPost);
postsRouter.patch("/like", authMiddleware, likePost);
postsRouter.patch("/comment", authMiddleware, commentOnPost);

module.exports = postsRouter;
