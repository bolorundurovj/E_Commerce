var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); 
var Handlebars = require('hbs');

var Product = require('../models/product');

mongoose.connect('mongodb://localhost:27017/ecommercestore'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("Database connection succeeded cart"); 
});

router.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180*60*1000 }
}));

/* GET home page. */
router.get('/', (req, res, next) => {
  var cart = req.session.cart;
        var displayCart = {items:[], total:0}
        var total=0;
        var totalQuantity = 0;

        //Get Total
        for(var item in cart){
            displayCart.items.push(cart[item]);
            total += (cart[item].qty * cart[item].price);
            //totalQuantity += Number(cart[item].qty);
        }
        displayCart.total = total;
        console.log(cart);
        //console.log(totalQuantity);

        //Render Cart
      
      res.render('cart', { title: 'E-Commerce || Cart', email: req.cookies.email, cart: cart, cartTotal: total, namee: req.cookies.cc, quant: req.cookies.quant});
     
});

router.post('/:id', function (req, res) {
  var quantity = req.body.quantity;
  req.session.cart = req.session.cart || {};
  var cart = req.session.cart;
  console.log(cart);
  var test = req.params.id;
  console.log(test);
  
Product.findOne({_id:test}, function(err,product){
   console.log(product);
      if(err){
          console.log(err);
      }
      if(cart[req.params.id]){
          cart[req.params.id].qty++;

      }
      else{
          cart[req.params.id] = {
              item:product._id,
              title: product.title,
              price: product.price,
              qty: quantity,
              imagePath: product.imagePath
          }
          console.log(cart);
      }

      var totalQuantity = 0;
      //Get Total
      for(var item in cart){
        totalQuantity += Number(cart[item].qty);
    }
    console.log(totalQuantity);
    res.cookie('quant', totalQuantity, {maxAge: 180*60*1000});
      res.render('./cart', {cart: cart, message:'Added to cart successfully', success:'message'});
      //res.clearCookie('quant');
      
      
      // res.redirect('/cart',);
  });
});

Handlebars.registerHelper('totalP', function(price, qty){
  return price * qty;
})

module.exports = router;
