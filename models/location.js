var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Location = new Schema({
    displayName: String,
    displayLastName: String,
    date: Date });
var Location = mongoose.model('Location', Location);
module.exports=Location;