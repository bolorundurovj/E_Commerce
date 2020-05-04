var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose'); 
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var nodemailer = require('nodemailer');
var crypto = require("crypto");
require('dotenv').config();


var Product = require('../models/product');
var Deal = require('../models/deals');
var User = require('../models/user');
var Cart = require('../models/cart');
var Token = require('../models/token');

//mongodb://admin:admin1234@ds014808.mlab.com:14808/ecommerceapp
//mongodb://localhost:27017/ecommercestore

mongoose.connect('mongodb://localhost:27017/ecommercestore'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("Database connection succeeded"); 
});



/* GET home page. */

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
      res.render('index', {title: 'E-Commerce', email: req.cookies.email, deal: dealChunk, clothes: productClothing, electronics:productElectronics, namee: req.cookies.cc, quant: req.cookies.quant});
            // console.log(dealChunk);
    }
  })
  }
  });
}
});
});

router.post('/search', function(req, res){
  var category = req.body.search;
  var collect = req.body.searchOptions;
  console.log(collect);
  console.log(category);
  stringCollect = String(collect);
  db.collection(stringCollect).find({title: category.toUpperCase()}).toArray(function(err, searchResult){
    if(err){
      console.log(err);
    }
    else{
      console.log(searchResult);
      res.cookie('search', searchResult);
      res.render(('grid-page'),{title: 'Results', searchResult: searchResult,stringCollect: stringCollect });
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
    User.findOne({ email: {$regex: email} })
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
        var user = new User(
          { 
            "firstName": firstName, 
            "lastName": lastName,
            "email":email, 
            "password":password, 
            "confirmPassword": confirmPassword,
            "hashedPass": hashedPass,
            "city": city,
            "country":country,
            "gender": gender,
            "terms": terms,
      
        });

        user.save((err) => {
          if (err) throw err; 
          console.log("New user registered Successfully"); 
        })

        console.log(user);
      // Create a verification token for this user
      var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
 
      // Save the verification token
      token.save(function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }

          // Send the email
          const sengridu = process.env.SENDGRID_USERNAME;
          const sengridp = process.env.SENDGRID_PASSWORD;
          console.log(sengridp+ '' + sengridu);
          var transporter = nodemailer.createTransport({
             service: 'Sendgrid',
              auth: { 
                user: sengridu,
                pass: sengridp}
             });
          var mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
          transporter.sendMail(mailOptions, function (err) {
              if (err) { return res.status(500).send({ msg: err.message }); }
              res.status(200).send('A verification email has been sent to ' + user.email + '.');
          });
        });  
        
    //     var data = { 
    //       "firstName": firstName, 
    //       "lastName": lastName,
    //       "email":email, 
    //       "password":password, 
    //       "confirmPassword": confirmPassword,
    //       "hashedPass": hashedPass,
    //       "city": city,
    //       "country":country,
    //       "gender": gender,
    //       "terms": terms,
    
    //   } 
    // db.collection('users').insertOne(data,function(err, collection){ 
    //       if (err) throw err; 
    //       console.log("New user registered Successfully"); 
                
    //   }); 
      

    //   let transport = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //             user: 'email@gmail.com',
    //             pass: 'password'
    //           }
    //   });
    //   let message = {
    //     from: 'email@gmail.com',
    //     to: email,
    //     subject: 'Design Your Model S | Tesla',
    //     html: '<h1>Have the most fun you can in a car!</h1><p>Get your <b>Tesla</b> today!</p>'
    // };
      
    //   transport.sendMail(message, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
    //   console.log(email);
    //   var mailOptions = {
    //     from: 'email@email.com',
    //     to: 'id@inbox.mailtrap.io',
    //     subject: 'Test Email',
    //     html: '<h1>Welcome</h1><p>That was easy!</p>'
    //   }
      
     //return res.render('./login', { message:'Registered Successfully. You can login now', success:'message'});
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
      if(user) {
        if(user.isVerified){
          // Load hash from your password DB.
        console.log(user.firstName);
        res.cookie('cc', user.firstName, {maxAge: 180*60*1000});
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
            //res.render(res.redirect('/'),{token: generateToken(user),message:'Logged in successfully', success:'message', email: req.cookies.email, quant: req.cookies.quant});
            res.redirect('/');
           console.log('logged in successfully', token + email);
           //res.cookie('token', token, {maxAge: 100000 * 1000});
           });
           
          }
      });
        }else{
        console.log('user is not verified')};
        res.redirect('/login?e='+ encodeURIComponent({message: 'You need to verify your account to login. Please check your email'}));
        }
      else{
        console.log('user does not exist');
      //res.render('/login', { message:'User does not exist', data });
      res.redirect('/login?e='+ encodeURIComponent({message: 'Incorrect username or password'}));
      
      }
    })

    
})

router.get('/confirmation/:token', (req, res, next) => {
  res.render('confirmation', { title: 'E-Commerce || Confirm', token: req.params.token});
  console.log(req.params.token);
});

router.post('/confirmation', (req, res, next) =>{
  // req.assert('email', 'Email is not valid').isEmail();
  // req.assert('email', 'Email cannot be blank').notEmpty();
  // req.assert('token', 'Token cannot be blank').notEmpty();
  // req.sanitize('email').normalizeEmail({ remove_dots: false });

  var email = req.body.email;
  var token = req.body.token;

  console.log(token);

  if(!email)
  {
    res. send({message:'User doesn\'t exist'})
  }
  if(!token)
  {
    res. send({message:'Token doesn\'t exist or may have expired'})
  }
  else
  {
    // Find a matching token
  Token.findOne({ token: req.body.token }, function (err, token) {
    if (!token) return res.status(400).send({ msg: 'We were unable to find a valid token. Your token may have expired.' });

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This user has already been verified.' });

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send("The account has been verified. Please log in.");
        });
    });
});
}
});

router.post('/resend', () => {

});

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
