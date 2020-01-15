var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var createError = require('http-errors');

//router.use(bodyParser);

var inde = require('./index');



const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];
 // var token = (req.body.token);
 //console.log(req.cookies.token);
 const heads = req.cookies.token;

  if(typeof heads !== 'undefined') {
      //const bearer = header.split(' ');
      const token = heads;

      req.token = token;
      console.log(req.token);
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
        //res.sendStatus(403)
        // render the error page
  //res.status(err.status || 403);
  res.render('error');
    } else {
        //If token is successfully verified, we can send the autorized data 
        console.log('Token verified');
        
    }
  
  
  /*lastName: req.user.lastName,
  email:req.user.email,
  password: req.user.password, 
  confirmPassword: req.user.confirmPassword,
  country:req.user.country, 
  gender: req.user.gender,
  terms: req.user.terms}  */

});
res.render('profile', {title: 'E-Commerce || Profile', firstName: req.body.firstName});
});



module.exports = router;
