var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('help', { title: 'E-Commerce || Help' });
});

module.exports = router;
