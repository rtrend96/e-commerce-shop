const Product = require("../models/product");

exports.getProduct = (req, res, next) => {
	Product.findAll({})
		.then((products) => {
			res.render("shop/product-list", {
				prods: products,
				pageTitle: "Rushi Product",
				path: "/products",
				activeSop: true,
				productCSS: true,
				layout: false,
			});
		})
		.catch((err) => {
			console.log("o/p→", err);
		});
};
exports.getProductDetail = (req, res, next) => {
	const productId = req.params.productId;
	Product.findByPk(productId)
		.then((product) => {
			res.render("shop/product-detail", {
				product: product,
				pageTitle: product.title,
				path: "/products",
			});
		})
		.catch((err) => {
			console.log("o/p→ err", err);
		});
};
exports.getIndex = (req, res, next) => {
	Product.findAll({})
		.then((products) => {
			res.render("shop/index", {
				prods: products,
				pageTitle: "Rushi Index Shop",
				path: "/",
			});
		})
		.catch((err) => {
			console.log("o/p→", err);
		});
};
exports.postCart = (req, res, next) => {
	console.log("o/p→ helllooo");
	const prodId = req.body.productId;
	let fetchedCart;
	let newQuantity = 1;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((products) => {
			let product;
			if (products.length > 0) {
				product = products[0];
			}

			if (product) {
				console.log("o/p→", product);
				const oldQuantity = product.cartItems.quantity;
				newQuantity = oldQuantity + 1;
				return product;
			}
			return Product.findByPk(prodId);
		})
		.then((product) => {
			return fetchedCart
				.addProduct(product, {
					through: { quantity: newQuantity },
				})
				.catch((err) => {
					console.log("o/p→", err);
				});
		})
		.then(() => {
			res.redirect("/cart");
		})
		.catch((err) => console.log(err));
};
exports.getCart = (req, res, next) => {
	req.user
		.getCart()
		.then((cart) => {
			return cart
				.getProducts()
				.then((cartProducts) => {
					res.render("shop/cart", {
						pageTitle: "Your Cart",
						path: "/cart",
						products: cartProducts,
					});
				})
				.catch((err) => {
					console.log("o/p→", err);
				});
		})
		.catch((err) => {
			console.log("o/p→ err", err);
		});
};

exports.postOrder = (req, res, next) => {
	let fetchedCart;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then((products) => {
			req.user
				.createOrder()
				.then((order) => {
					return order.addProducts(
						products.map((product) => {
							product.orderItems = { quantity: product.cartItems.quantity };
							return product;
						}),
					);
				})
				.catch((err) => {
					console.log("o/p→", err);
				});
		})
		.then((result) => {
			fetchedCart.setProducts(null); // remove products from the session so that it can be cleared
		})
		.then((result) => {
			res.redirect("/orders");
		})
		.catch((err) => {
			console.log("o/p→", err);
		});
};
exports.getOrders = (req, res, next) => {
	req.user
		.getOrders({ include: ["products"] })
		.then((orders) => {
			console.log("o/p→", orders);
			res.render("shop/orders", {
				pageTitle: "Your Orders",
				path: "/orders",
				orders: orders,
			});
		})
		.catch((err) => {
			console.log("o/p→", err);
		});
};
exports.deleteCart = (req, res, next) => {
	const productId = req.body.productId;
	req.user
		.getCart()
		.then((products) => {
			return products
				.getProducts({ where: { id: productId } })
				.then((product) => {
					return product[0].cartItems.destroy();
				})
				.then((result) => {
					res.redirect("/cart");
				})
				.catch((err) => {
					console.log("o/p→", err);
				});
		})
		.catch((err) => {
			console.log("o/p→", err);
		});
};
