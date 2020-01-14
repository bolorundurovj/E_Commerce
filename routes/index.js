var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/ecommercestore'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log(" Database connection succeeded"); 
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'E-Commerce'});
});

router.post('/register', function(req,res){ 
  var firstName = req.body.firstName; 
  var lastName = req.body.lastName;
  var email =req.body.email; 
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
    var data = { 
      "firstName": firstName, 
      "lastName": lastName,
      "email":email, 
      "password":password, 
      "confirmPassword": confirmPassword,
      "country":country,
      "gender": gender,
      "terms": terms

  } 
db.collection('users').insertOne(data,function(err, collection){ 
      if (err) throw err; 
      console.log("Record inserted Successfully"); 
            
  }); 
        
 // return res.redirect('/login', ); 
 return res.render('./login', { message:'Registered Successfully. You can login now', success:'message'});
  }
})

module.exports = router;
