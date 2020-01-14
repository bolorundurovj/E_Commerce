var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String, required:true},
    city: {type: String, required:true},
    country: {type: String, required:true},
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    password: {type: String, required:true},
    confirmPassword: {type: String, required:true},
    hashedPass:{type:String},
    date: { type: Date, default: Date.now}
});


var User = mongoose.model('User', userSchema);

module.exports = User;