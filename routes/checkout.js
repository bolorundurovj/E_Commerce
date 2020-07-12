const express = require("express");
const router = express.Router();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const Handlebars = require("hbs");
const jwt = require("jsonwebtoken");

router.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

const checkToken = (req, res, next) => {
  const header = req.headers["authorization"];
  const heads = req.cookies.token;

  if (typeof heads !== "undefined") {
    //const bearer = header.split(' ');
    const token = heads;

    req.token = token;
    console.log(req.token);
    next();
  } else {
    res.render("./login", { message: "You need to log in" });
  }
};

/* GET home page. */
router.get("/", checkToken, (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, res) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");

      // error handler
      router.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // render the error page
        res.status(err.status || 403);
        res.render("error");
      });
    } else {
      //If token is successfully verified, we can send the autorized data
      console.log("Token verified");
    }
  });

  let cart = req.session.cart;
  let displayCart = { items: [], total: 0 };
  let total = 0;
  let totalQ = 0;

  for (var item in cart) {
    displayCart.items.push(cart[item]);
    total += cart[item].qty * cart[item].price;
    totalQ += cart[item].qty * 1;
  }
  displayCart.total = total;

  let totalQty = totalQ;

  res.render("checkout", {
    title: "E-Commerce || Checkout",
    email: req.cookies.email,
    cart: cart,
    totalQty: totalQty,
    cartTotal: total,
    namee: req.cookies.cc,
    quant: req.cookies.quant,
  });
  console.log(cart);
});

Handlebars.registerHelper("totalP", function (price, qty) {
  return price * qty;
});

module.exports = router;
