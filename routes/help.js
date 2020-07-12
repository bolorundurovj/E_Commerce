const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("help", {
    title: "E-Commerce || Help",
    email: req.cookies.email,
    namee: req.cookies.cc,
    quant: req.cookies.quant,
  });
});

module.exports = router;
