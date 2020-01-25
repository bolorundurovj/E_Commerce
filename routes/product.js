var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 

var Product = require('../models/product');
var Cart = require('../models/cart');

mongoose.connect('mongodb://localhost:27017/ecommercestore'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("Database connection succeeded product"); 
})


/* GET home page. */
router.get('/:id', (req, res, next) => {
    
  Product.findOne({_id: req.params.id}, function(err, docs){
    if(err) {
              res.json(err);
   }
    else {
            res.render('product', {title: 'E-Commerce || Product', product: docs, email: req.cookies.email });
            console.log(docs);
    }
  });

  //res.render('product', { title: 'E-Commerce || Product', email: req.cookies.email });
});

router.get('/product/add-to-cart/:id', function(req, res, next) {
	var productId = req.params.id;
	const cart = new Cart(req.session.cart ? req.session.cart : {});

	Deal.findById(productId, function(err, product){
		if(err){
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('/');
  });
});



module.exports = router;