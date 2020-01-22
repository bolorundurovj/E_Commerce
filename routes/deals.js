var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 

var Deal = require('../models/deals');
var Cart = require('../models/cart');

mongoose.connect('mongodb://localhost:27017/ecommercestore'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("Database connection succeeded deals"); 
})



router.get('/:id', (req, res, next) => {
    
  Deal.findOne({_id: req.params.id}, function(err, docs){
    if(err) {
              res.json(err);
   }
    else {
            res.render('deal', {title: 'E-Commerce || Deals&Offers', deal: docs, email: req.cookies.email });
            console.log(docs);
    }
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
	var dealId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(dealId, function(err, product){
		if(err){
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('/');
	});
});



module.exports = router;