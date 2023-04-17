const express = require("express");
const userRouter = express.Router();

const authMiddleware = require("../middlewares/auth");
const {
  getUser,
  updateUser,
  deleteUser,
  getAllFriends,
  addRemoveFriend,
} = require("../controllers/user");

userRouter
  .route("/")
  .get(authMiddleware, getUser)
  .patch(authMiddleware, updateUser)
  .delete(authMiddleware, deleteUser);

userRouter.get("/friends", authMiddleware, getAllFriends);
userRouter.patch("/friends/:friendId", authMiddleware, addRemoveFriend);

module.exports = userRouter;
