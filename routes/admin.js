const path = require("path");

const express = require("express");

const adminRouter = express.Router();

const adminController = require("../controllers/admin");

//filtering routes Get
adminRouter.get("/add-product", adminController.getAddProduct);

adminRouter.get("/edit-product/:productId", adminController.getEditProduct);
adminRouter.post("/edit-product", adminController.postEditProduct);

adminRouter.get("/products", adminController.getProducts);
//and post
adminRouter.post("/add-product", adminController.PostAddProduct);
adminRouter.post("/delete-product", adminController.postDeleteProduct);
module.exports = adminRouter;
