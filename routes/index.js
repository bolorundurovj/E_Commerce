var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose'); 
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var nodemailer = require('nodemailer');


var Product = require('../models/product');
var Deal = require('../models/deals');
var User = require('../models/user');
var Cart = require('../models/cart');

mongoose.connect('mongodb://localhost:27017/ecommercestore'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("Database connection succeeded"); 
});



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

router.post('/search', function(req, res){
  var title = req.body.search;
  var collect = req.body.searchOptions;
  console.log(collect);
  stringCollect = String(collect);
  db.collection(stringCollect).find({title: title }).toArray(function(err, searchResult){
    if(err){
      console.log(err);
    }
    else{
      console.log(searchResult);
      res.render(('grid-page'),{title: 'Results', searchResult: searchResult, });
    }
  })
})

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

      let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
                user: 'email@gmail.com',
                pass: 'password'
              }
      });
      let message = {
        from: 'email@gmail.com',
        to: email,
        subject: 'Design Your Model S | Tesla',
        html: '<h1>Have the most fun you can in a car!</h1><p>Get your <b>Tesla</b> today!</p>'
    };
      
      transport.sendMail(message, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      console.log(email);
      var mailOptions = {
        from: 'bolorundurovb@gmail.com',
        to: 'f45ac69949-f965c2@inbox.mailtrap.io',
        subject: 'Test Email',
        html: '<h1>Welcome</h1><p>That was easy!</p>'
      }
      
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
            res.cookie('token', token, {maxAge: 180*60*1000});
            res.cookie('email', email, {maxAge: 180*60*1000});
            res.render(res.redirect('/'),{message:'Logged in successfully', success:'message', email: req.cookies.email});
            //res.redirect('/');
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


module.exports = router;
