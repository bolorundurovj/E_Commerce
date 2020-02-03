var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('login', { title: 'E-Commerce || Login', email: req.cookies.email, namee: req.cookies.cc});
  
});

module.exports = router;