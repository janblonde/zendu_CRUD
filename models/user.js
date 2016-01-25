var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    company: String,
    vat_number: String,
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    streetname: String,
    streetnumber: String,
    zipcode: String,
    city: String
    
});
var User = mongoose.model('User', User);
module.exports=User;