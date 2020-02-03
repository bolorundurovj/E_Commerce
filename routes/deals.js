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
            res.render('deal', {title: 'E-Commerce || Deals&Offers', deal: docs, email: req.cookies.email, namee: req.cookies.cc});
            console.log(docs);
    }
  });
});



module.exports = router;