const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
require('dotenv').config();

// Connecting to Mongoose
mongoose.connect(`${process.env.DB_PROD}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const dbStat = mongoose.connection;
dbStat.on("error", console.log.bind(console, "connection error"));
dbStat.once("open", function (callback) {
  console.log("Database connection succeeded Index");
});

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const helpRouter = require("./routes/help");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const cartRouter = require("./routes/cart");
const profileRouter = require("./routes/profile");
const checkoutRouter = require("./routes/checkout");
const productRouter = require("./routes/product");
const gridPageRouter = require("./routes/grid-page");
const listPageRouter = require("./routes/list-page");
const dealRouter = require("./routes/deals");
const orderRouter = require("./routes/orders");
const clotheRouter = require("./routes/clothing");
const wishRouter = require("./routes/wishlist");
const app = express();

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
