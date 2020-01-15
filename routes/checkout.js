var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('checkout', { title: 'E-Commerce || Checkout' });
});

module.exports = router;
