const express = require("express");
const authRouter = express.Router();

const upload = require("../helpers/upload");
const { registerUser, loginUser } = require("../controllers/auth");

authRouter.post("/register", upload.single("avatar"), registerUser);
authRouter.post("/login", loginUser);

module.exports = authRouter;
