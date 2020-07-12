const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("list-page", {
    title: "E-Commerce || Results",
    email: req.cookies.email,
    namee: req.cookies.cc,
    quant: req.cookies.quant,
    searchResult: req.cookies.search,
  });
});

module.exports = router;
