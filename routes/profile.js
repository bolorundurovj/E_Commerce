var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var createError = require("http-errors");

var User = require("../models/user");

//mongodb://admin:admin1234@ds014808.mlab.com:14808/ecommerceapp
//mongodb://localhost:27017/ecommercestore

mongoose.connect(process.env.DB_DEV);
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("Database connection succeeded for profile");
});

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
    //If header is undefined return Forbidden (403)
    res.render("./login", { message: "You need to log in" });
  }
};

/* GET home page. */
router.get("/", checkToken, (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, res) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      //res.sendStatus(403)
      // render the error page
      //res.status(err.status || 403);
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


  db.collection("users").findOne({ email: req.cookies.email }, function (
    err,
    docs
  ) {
    if (err) {
      res.json(err);
    } else {
      res.render("profile", {
        title: "E-Commerce || Profile",
        docs: docs,
        email: req.cookies.email,
        namee: req.cookies.cc,
        quant: req.cookies.quant,
      });

      console.log(docs);
    }
  });
});

module.exports = router;
