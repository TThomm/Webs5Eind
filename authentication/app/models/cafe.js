// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var cafeSchema = new mongoose.Schema({
    id: String,
    name: String,
    placeid: String
});

// methods ======================
// generating a hash




// create the model for users and expose it to our app
module.exports = mongoose.model('Cafe', cafeSchema);
