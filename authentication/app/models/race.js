// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var raceSchema = mongoose.Schema({

    race: {
        id: String,
        placeid: String,
        starttime: String,
        endtime: String,
        users: [{ type: String, required: true, ref: 'user' /* Pseudo-joins */ }],
        cafes: [{ type: String, required: false, ref: 'cafe' /* Pseudo-joins */ }]
    }

});

// methods ======================
// generating a hash




// create the model for users and expose it to our app
module.exports = mongoose.model('Cafe', cafeSchema);
