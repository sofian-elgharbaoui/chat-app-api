const express = require("express");
const productsRouter = express.Router();

const upload = require("../helpers/upload");
const authMiddleware = require("../middlewares/auth");
const {
  getProduct,
  getFeedProducts,
  getUserProducts,
  createProduct,
  likeProduct,
  commentOnProduct,
} = require("../controllers/products");

productsRouter
  .route("/")
  .get(authMiddleware, getFeedProducts)
  .post(authMiddleware, upload.single("postPicture"), createProduct);

productsRouter.get("/profile", authMiddleware, getUserProducts);
productsRouter.get("/:productId", authMiddleware, getProduct);
productsRouter.patch("/like", authMiddleware, likeProduct);
productsRouter.patch("/comment", authMiddleware, commentOnProduct);

module.exports = productsRouter;
