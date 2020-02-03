var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('register', { title: 'E-Commerce || Register', email: req.cookies.email, namee: req.cookies.cc});
});



module.exports = router;