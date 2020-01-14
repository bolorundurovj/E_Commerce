var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    email: {type: String, required:true},
    city: {type: String, required:false},
    country: {type: String, required:false},
    firstName: {type: String, required:true},
    lastName: {type: String, required:false},
    password: {type: String, required:true},
    confirmPassword: {type: String, required:false},
    
    date: { type: Date, default: Date.now}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;