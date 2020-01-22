var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose'); 
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');


var Product = require('../models/product');
var Deal = require('../models/deals');
var User = require('../models/user');
var Cart = require('../models/cart');

mongoose.connect('mongodb://localhost:27017/ecommercestore'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("Database connection succeeded"); 
})


/* GET home page. */
/*router.get('/', function(req, res, next) {
  db.collection('products').find().toArray( function(err, productChunk){
    if(err) {
              res.json(err);
   }
    else {
      res.render('index', {title: 'E-Commerce', email: req.cookies.email, product: productChunk});
            console.log(productChunk);
    }
  });
 
});*/

router.get('/', function(req, res, next) {
  db.collection('products').find({category:"electronics"}).toArray( function(err, productElectronics){
    if(err) {
              res.json(err);
   }
    else {
  db.collection('products').find({category:"clothing"}).toArray( function(err, productClothing){
    if(err) {
              res.json(err);
   }
    else {
  db.collection('deals').find().toArray( function(err, dealChunk){
    if(err) {
              res.json(err);
   }
    else {
      res.render('index', {title: 'E-Commerce', email: req.cookies.email, deal: dealChunk, clothes: productClothing, electronics:productElectronics});
            console.log(dealChunk);
    }
  })
  }
  });
}
});
});

router.post('/register', function(req,res){ 
  var firstName = req.body.firstName; 
  var lastName = req.body.lastName;
  var email =req.body.email; 
  var city = req.body.city;
  var password = req.body.password; 
  var confirmPassword = req.body.confirmPassword;
  var country =req.body.country; 
  var gender = req.body.gender;
  var terms = req.body.terms;

  if(!firstName || !lastName || !password || !confirmPassword || !email || !country || !gender) {
    res.render('./register', {message:'Please fill all fields'});
  }
  if(!terms){
    res.render('./register', {message:'Please accept the terms to continue'});
  }
  if(password !== confirmPassword){
    res.render('./register', {message:'Passwords dont match'});
  }
  if(password.length < 6){
    res.render('./register', {message:'Password length should be more than 6'});
  }

  else{

    //validation passed
    User.findOne({ email: email })
    .then(user => {
      if(user) {
        res.render('./register', {
          message:'Email already exists'
      });
    }
    else{
      bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB
        var hashedPass = hash;
        var data = { 
          "firstName": firstName, 
          "lastName": lastName,
          "email":email, 
          "password":password, 
          "confirmPassword": confirmPassword,
          "hashedPass": hashedPass,
          "city": city,
          "country":country,
          "gender": gender,
          "terms": terms
    
      } 
    db.collection('users').insertOne(data,function(err, collection){ 
          if (err) throw err; 
          console.log("New user registered Successfully"); 
                
      }); 
             
     return res.render('./login', { message:'Registered Successfully. You can login now', success:'message'});
    });    
  }
  });
  }
})

router.post('/login', function(req,res){
  var email = req.body.email;
  var password =req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if(!user) {
        res.render('./login', { message:'User does not exist', data });
        console.log('user does not exist'); 
    }
      else{
        // Load hash from your password DB.
      bcrypt.compare(password, user.hashedPass, function(err, isMatch) {
        // res == true
        if(!isMatch){
        res.render('./login', {message:'Password is incorrect', });
        console.log('incorrect password');
        }
        if(isMatch){
            jwt.sign({ email: email }, 'secretkey', { expiresIn: '3h'}, (err, token) => {
            res.cookie('token', token);
            res.cookie('email', email);
            res.render('index', {message:'Logged in successfully', success:'message', email: req.cookies.email});
           console.log('logged in successfully', token + email);
           //res.cookie('token', token, {maxAge: 100000 * 1000});
           });
           
          }
      });
      }
    })

    
})

/* router.post('/search', function(req,res){ 
  var search = req.body.search; 
  

  if(!search) {
    res.render('/', {message:'Please fill the searchbar'});
  }
  else{
    db.collection('products').find({title: search}).toArray( function(err, productChunk){
      if(err) {
                res.json(err);
     }
      else {
        res.render('./grid-page', { email: req.cookies.email, product: productChunk});
              console.log(productChunk);
      }
    });
}
}); */

router.get('/logout', (req, res) => {
  //req.logout();
  res.clearCookie('token');
  res.clearCookie('email');
  res.render('index', {message:"You are now logged out", success:'message'});
});

router.get('/add-to-cart/:id', function(req, res, next) {
	var dealId = req.params.id;
	const cart = new Cart(req.session.cart ? req.session.cart : {});

	Deal.findById(dealId, function(err, product){
		if(err){
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('/');
	});
});




module.exports = router;
