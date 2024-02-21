const path = require("path");

const express = require("express");

const shopRouter = express.Router();

const shopController = require("../controllers/shop");

shopRouter.get("/", shopController.getIndex);

shopRouter.get("/products", shopController.getProduct);
shopRouter.get("/products/:productId", shopController.getProductDetail);
shopRouter.get("/cart", shopController.getCart);
shopRouter.post("/create-order", shopController.postOrder);
shopRouter.get("/orders", shopController.getOrders);
shopRouter.post("/cart", shopController.postCart);
shopRouter.post("/cart-delete-item", shopController.deleteCart);

module.exports = shopRouter;
