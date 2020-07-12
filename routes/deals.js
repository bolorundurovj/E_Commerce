const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Deal = require("../models/deals");
const Cart = require("../models/cart");

mongoose.connect(`${process.env.DB_PROD}`);
const db = mongoose.connection;
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
