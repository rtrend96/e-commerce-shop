const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
//db
const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();
//set template we are setting ejs
app.set("view engine", "ejs");
app.set("views", "views"); // to set where to find it

const rootDir = require("./utils/path");
const adminRouters = require("./routes/admin");
const shopRouters = require("./routes/shop");

//this will allow to use middleware functions
app.use(bodyParser.urlencoded({ extended: false }));
//to access files statically
app.use(express.static(path.join(__dirname, "public")));

//use for middle ware request as imcoming request and response object
app.use((req, res, next) => {
	User.findByPk(1)
		.then((user) => {
			req.user = user;
			//console.log("o/p→req.user", req.user.id);
			next();
		})
		.catch((err) => {
			console.log("o/p→", err);
		});
});

app.use("/admin", adminRouters);
app.use(shopRouters);
const errorController = require("./controllers/error");
//404 error page
app.use(errorController.Status404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
//Product.belongsToMany(Order, { through: OrderItem });
sequelize
	.sync()
	//.sync({ force: true })
	.then((results) => {
		return User.findByPk(1);
	})
	.then((user) => {
		if (!user) {
			return User.create({ name: "Rushi", email: "rushi@gmail.com" });
		}
		return user;
	})
	.then((user) => {
		// console.log("o/p→", user);
		return user.createCart();
	})
	.then((cart) => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log("o/p→ err", err);
	});
//using express
