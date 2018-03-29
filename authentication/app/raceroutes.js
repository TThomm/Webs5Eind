var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');

router.get('/', isLoggedIn, function (req, res) {
    
    
    //request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDguC3IklgL1LwV828atdW1lJqbkcRQhpU&location=51.72512,%205.30323&radius=2000&type=cafe', function (error, response, body) {
    //    console.log('error:', error); // Print the error if one occurred
    //    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //    console.log('body:', body); // Print the HTML for the Google homepage.
    //});


    res.render('races.ejs');
});

router.get('/create', isLoggedIn, function (req, res) {


    


    res.render('coordinates.ejs');
});

router.post('/create', isLoggedIn, function (req, res) {

    var coordinates = req.body
    var latitude = coordinates.latitude;
    var longitude = coordinates.longitude;

    var call = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDguC3IklgL1LwV828atdW1lJqbkcRQhpU&location=" + latitude + "," + longitude + "&radius=2000&type=cafe";
 
    request(call, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        getCafes(body);
    });

    

    res.render('createRace.pug', {
        coordinatess: coordinates
    });
});



function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
}

function getCafes(json) {
    obj = JSON.parse(json).results;

    for (i = 0; i < obj.length; i++) {
        var name = obj[i].name;
        var placeid = obj[i].place_id;
        var rating = obj[i].rating;
        var adress = obj[i].vicinity

        console.log(name);
        console.log(placeid);
        console.log(rating);
        console.log(adress);
    }

}



module.exports = router;

