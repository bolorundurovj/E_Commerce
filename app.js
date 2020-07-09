var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
require('dotenv').config();

// Connecting to Mongoose
mongoose.connect(`${process.env.DB_PROD}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var helpRouter = require("./routes/help");
var loginRouter = require("./routes/login");
var registerRouter = require("./routes/register");
var cartRouter = require("./routes/cart");
var profileRouter = require("./routes/profile");
var checkoutRouter = require("./routes/checkout");
var productRouter = require("./routes/product");
var gridPageRouter = require("./routes/grid-page");
var listPageRouter = require("./routes/list-page");
var dealRouter = require("./routes/deals");
var orderRouter = require("./routes/orders");
var clotheRouter = require("./routes/clothing");
var wishRouter = require("./routes/wishlist");

var app = express();

// view engine setup.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/help", helpRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/cart", cartRouter);
app.use("/profile", profileRouter);
app.use("/checkout", checkoutRouter);
app.use("/product", productRouter);
app.use("/grid-page", gridPageRouter);
app.use("/list-page", listPageRouter);
app.use("/deal", dealRouter);
app.use("/orders", orderRouter);
app.use("/clothing", clotheRouter);
app.use("/wishlist", wishRouter);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
