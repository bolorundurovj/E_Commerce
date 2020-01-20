var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/ecommercestore/products');
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("Database connection succeeded for product seeder"); 
})

var products = [
		new Product({
			imagePath: '/images/items/11.jpg',
            title: 'Camera',
            category: 'electronics',
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate voluptatibus quia nobis, perspiciatis sequi tenetur repudiandae dicta iure.',
			price: 360
		}),
		new Product({
			imagePath: './images/items/6.jpg',
            title: 'Sofa',
            category: 'furniture',
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate voluptatibus quia nobis, perspiciatis sequi tenetur repudiandae dicta iure.',
			price: 300
		}),
		new Product({
			imagePath: './images/items/1.jpg',
            title: 'T-shirt',
            category: 'clothing',
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate voluptatibus quia nobis, perspiciatis sequi tenetur repudiandae dicta iure.',
			price: 540
		}),
		new Product({
			imagePath: './images/items/14.jpg',
            title: 'Cooker',
            category: 'kitchen',
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate voluptatibus quia nobis, perspiciatis sequi tenetur repudiandae dicta iure.',
			price: 320
		}),
		
];

for (var i = 0, done=0; i < products.length; i++) {
	 
	products[i].save(function (err, result) {
		done++;
		if(done == products.length)
			mongoose.disconnect();
	});
}