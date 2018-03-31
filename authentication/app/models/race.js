// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var raceSchema = new mongoose.Schema({

        id: String,
        name: String,
        owner: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'user' /* Pseudo-joins */ },
        starttime: String,
        endtime: String,
        participants: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'user' /* Pseudo-joins */ }],
        cafes: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'cafe' }]
    

},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

//Race
//.findOne({ firstname: 'Aaron' })
//.populate('eventsAttended') // only works if we pushed refs to person.eventsAttended
//.exec(function (err, person) {
//    if (err) return handleError(err);
//    console.log(person);
//});
// methods ======================
// generating a hash




// create the model for users and expose it to our app
module.exports = mongoose.model('Race', raceSchema);
