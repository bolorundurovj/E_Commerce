const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const Cart = require("../models/cart");

// mongoose.connect(`${process.env.DB_PROD}`);
// var db = mongoose.connection;
// db.on("error", console.log.bind(console, "connection error"));
// db.once("open", function (callback) {
//   console.log("Database connection succeeded product");
// });

router.get("/:id", (req, res, next) => {
  Product.findOne({ _id: req.params.id }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.render("product", {
        title: "E-Commerce || Product",
        product: docs,
        email: req.cookies.email,
        namee: req.cookies.cc,
        quant: req.cookies.quant,
      });
      console.log(docs);
    }
  });
});

module.exports = router;
