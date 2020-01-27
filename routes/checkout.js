var express = require('express');
var router = express.Router();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); 
var mongoose = require('mongoose');
var Handlebars = require('hbs');

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
        var totalQ=0;

  for(var item in cart){
    displayCart.items.push(cart[item]);
    total += (cart[item].qty * cart[item].price);
     totalQ += (cart[item].qty * 1);
  }
displayCart.total = total;


  var totalQty = totalQ;

  res.render('checkout', { title: 'E-Commerce || Checkout', email: req.cookies.email, cart: cart, totalQty: totalQty, cartTotal: total });
  console.log(cart);
});

Handlebars.registerHelper('totalP', function(price, qty){
  return price * qty;
})

module.exports = router;
