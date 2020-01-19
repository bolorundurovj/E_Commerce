var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('cart', { title: 'E-Commerce || Cart', email: req.cookies.email });
});

module.exports = router;
