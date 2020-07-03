var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var Deal = require("../models/deals");
var Cart = require("../models/cart");

//mongodb://admin:admin1234@ds014808.mlab.com:14808/ecommerceapp
//mongodb://localhost:27017/ecommercestore

mongoose.connect(process.env.DB_DEV);
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("Database connection succeeded deals");
});

router.get("/:id", (req, res, next) => {
  Deal.findOne({ _id: req.params.id }, function (err, docs) {
    if (err) {
      res.json(err);
    } else {
      res.render("deal", {
        title: "E-Commerce || Deals&Offers",
        deal: docs,
        email: req.cookies.email,
        namee: req.cookies.cc,
        quant: req.cookies.quant,
      });
      console.log(docs);
    }
  });
});

module.exports = router;
