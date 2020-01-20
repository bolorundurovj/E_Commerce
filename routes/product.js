var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 

mongoose.connect('mongodb://localhost:27017/ecommercestore'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("Database connection succeeded product"); 
})


/* GET home page. */
router.get('/', (req, res, next) => {
  db.collection('products').find({_id: req.body._id}).toArray( function(err, data){
    if(err) {
              res.json(err);
   }
    else {
      res.render('product', {title: 'E-Commerce || Product', email: req.cookies.email, product: data});
            console.log(data);
    }
  });

  //res.render('product', { title: 'E-Commerce || Product', email: req.cookies.email });
});



module.exports = router;