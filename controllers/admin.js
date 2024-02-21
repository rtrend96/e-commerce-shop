const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		activeAddProduct: true,
		formCSS: true,
		productCSS: true,
		editing: false,
	});
};

exports.PostAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	req.user
		.createProduct({
			title: title,
			price: price,
			imageUrl: imageUrl,
			description: description,
		})
		.then((results) => {
			console.log("o/p→ results created");
			res.redirect("/admin/products");
		})
		.catch((err) => {
			console.log("o/p→err", err);
		});
};
exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/");
	}
	const prodId = req.params.productId;
	req.user
		.getProducts({ where: { id: prodId } })
		// Product.findByPk(prodId)
		.then((products) => {
			const product = products[0]; //products[0] is used to get the first element of the array
			if (!product) {
				return res.redirect("/");
			}
			res.render("admin/edit-product", {
				pageTitle: "Edit Product",
				path: "/admin/edit-product",
				editing: editMode,
				product: product,
			});
		})
		.catch((err) => {
			console.log("o/p→", err);
		});
};
exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDesc = req.body.description;
	Product.findByPk(prodId)
		.then((product) => {
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.imageUrl = updatedImageUrl;
			product.description = updatedDesc;
			return product.save();
		})
		.then((result) => {
			console.log("o/p→ Updated Pro");
			res.redirect("/admin/products");
		})
		.catch((err) => {
			console.log("o/p→", err);
		});
};
exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findByPk(prodId)
		.then((product) => {
			return product.destroy();
		})
		.then((result) => {
			console.log("o/p→ Deleted");
			res.redirect("/admin/products");
		})
		.catch((err) => {
			console.log("o/p→", err);
		});
};
exports.getProducts = (req, res, next) => {
	req.user
		.getProducts()
		.then((product) => {
			res.render("admin/products", {
				prods: product,
				pageTitle: "Admin Products",
				path: "/admin/products",
			});
		})
		.catch((err) => {
			console.log("o/p→", err);
		});
};
