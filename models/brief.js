var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Brief = new Schema({
    _user : { type: ObjectId, ref: 'User' },
    destinationCompany: String,
    destinationLastName: String,
    destinationFirstName: String,
    destinationStreetName: String,
    destinationStreetNumber: String,
    destinationZipCode: String,
    destinationCity: String,
    destinationEmail: String,
    senderCompany: String,
    senderLastName: String,
    senderFirstName: String,
    senderStreetName: String,
    senderStreetNumber: String,
    senderZipCode: String,
    senderCity: String,
    senderEmail: String,
    status: String,
    createdAt: Date,
    sent_date: Date
});
var Brief = mongoose.model('Brief', Brief);
module.exports=Brief;