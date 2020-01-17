var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose'); 
var createError = require('http-errors');



var User = require('../models/user');

mongoose.connect('mongodb://localhost:27017/ecommercestore'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("Database connection succeeded for profile"); 
})


const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];

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
      res.redirect('./login');
    } else {
        //If token is successfully verified, we can send the autorized data 
        console.log('Token verified');
        
    }
  
  
  

});

db.collection("users").findOne({email:req.body.email}, function(err, result) {
  if (err) throw err;
  console.log(result);
  //db.close();
  console.log("db closed");
});

User.find({}, function(err, docs){
  if(err) {
            res.json(err);
 }
  else {
          res.render('profile', {title: 'E-Commerce || Profile', docs: docs[3] });
          console.log(docs);
  }
});
});


module.exports = router;
