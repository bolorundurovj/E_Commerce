var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('checkout', { title: 'E-Commerce || Checkout', email: req.cookies.email });
});

module.exports = router;
