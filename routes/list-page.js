var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('list-page', { title: 'E-Commerce || Results', email: req.cookies.email });
});

module.exports = router;