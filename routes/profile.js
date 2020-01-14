var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');

const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];

  if(typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const token = bearer[1];

      req.token = token;
      next();
  } else {
      //If header is undefined return Forbidden (403)
      res.render('./login', {message:'You need to log in'});
  }
}

/* GET home page. */
router.get('/', checkToken, (req, res, next) => {
  jwt.verify(req.token, 'secretkey', (err, res) => {
    if(err){
        //If error send Forbidden (403)
        console.log('ERROR: Could not connect to the protected route');
        res.sendStatus(403)
    } else {
        //If token is successfully verified, we can send the autorized data 
        res.render('profile', { title: 'E-Commerce || Profile'});
    }
  
  /*firstName: req.user.firstName,
  lastName: req.user.lastName,
  email:req.user.email,
  password: req.user.password, 
  confirmPassword: req.user.confirmPassword,
  country:req.user.country, 
  gender: req.user.gender,
  terms: req.user.terms}  */

});
});



module.exports = router;
