const express = require("express");
const checkoutRouter = express.Router();

const { createOrder, completeOrder } = require("../controllers/checkout");
const authMiddleware = require("../middlewares/auth");
checkoutRouter.post("/create_order", authMiddleware, createOrder);
checkoutRouter.post("/complete_order", authMiddleware, completeOrder);

module.exports = checkoutRouter;
