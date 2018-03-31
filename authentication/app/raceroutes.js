var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');
var Cafe = require('../app/models/cafe');
var Race = require('../app/models/race');
var User = require('../app/models/user');

var mongoose = require('mongoose');
var Rees = mongoose.model('Race');
var user = new User();
router.get('/', isLoggedIn,
    function (req, res) {
        user = req.user;
    //request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDguC3IklgL1LwV828atdW1lJqbkcRQhpU&location=51.72512,%205.30323&radius=2000&type=cafe', function (error, response, body) {
    //    console.log('error:', error); // Print the error if one occurred
    //    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //    console.log('body:', body); // Print the HTML for the Google homepage.
    //});
        
        var result = Race.find({});
        var allRaces;
        result.exec((err, data) => {
            allRaces = data;
            console.log(allRaces);

            res.render('races.ejs',
                {
                    races: allRaces,
                    user: user
                });
        });
       
});

router.get('/create', isLoggedIn,
    function (req, res) {


    


    res.render('coordinates.ejs');
});

router.post('/create', isLoggedIn,
    function (req, res) {

    var coordinates = req.body
    var latitude = coordinates.latitude;
    var longitude = coordinates.longitude;
    var caves;

    var call = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDguC3IklgL1LwV828atdW1lJqbkcRQhpU&location=" + latitude + "," + longitude + "&radius=2000&type=cafe";
 
    request(call, function (error, response, body) {
        //console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.
        caves = getCafes(body);
        var placeids = [];
        var names = [];
        for(i = 0; i < caves.length; i++){
            placeids[i] = caves[i].placeid;
            names[i] = caves[i].name;
        }

        res.render('createRace.ejs', {
            coordinatess: coordinates,
            placeids: placeids,
            names: names
        });
    });

    

    
    });

router.post('/', isLoggedIn, function (req, res) {
    var data = req.body;
    
    console.log(req.body);
    console.log(res._passport);
    //console.log("ERRT");
    //console.log("ERRT");
    //console.log(req.body.cafes);
    //console.log("ERRT");
    //console.log(req.body.cafe);
    //console.log("ERRT");
    //console.log(req.body.cafe2);
    var cafes = data.placeid;
    var raceName = data.name;
    var starttime = data.starttime;
    var endtime = data.endTime;
    //console.log(endtime);
    var race = new Race();
    race.name = raceName;
    race.starttime = starttime;
    race.endtime = endtime;
    race.owner = user;
    race.participants = race.participants.concat(user);
    for (var i = 0; i < cafes.length; i++) {
        var newCafe = new Cafe();
        newCafe.placeid = cafes[i];
       // console.log(newCafe.placeId);
        //console.log(cafes[i]);
        caves = [];
        var call = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyDguC3IklgL1LwV828atdW1lJqbkcRQhpU&placeid=" + cafes[i];
        
        request(call, function (error, response, body) {
            //console.log('error:', error); // Print the error if one occurred
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            //console.log('body:', body); // Print the HTML for the Google homepage.
            caves[i] = getCafe(body);
            race.cafes = race.cafes.concat(caves[i]);
            if (i == (cafes.length)) {
                race.save(function (err, savedRace) {
                    console.log('err', err);
                    console.log('savedRace', savedRace);
                });
            }
        });
       
    }
    
  

    //
    //Hier moet nog komen waar de pagina heen geleid moet worden
    //
    
    
    var result = Race.find({});
    var allRaces;
    result.exec((err, data) => {
        allRaces = data;
        console.log(allRaces);

        res.render('races.ejs',
            {
                races: allRaces,
                user: user
            });
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
    var caves = [];
    for (i = 0; i < obj.length; i++) {
        var name = obj[i].name;
        var placeid = obj[i].place_id;
        var rating = obj[i].rating;
        var adress = obj[i].vicinity

        var newCafe = new Cafe();
        newCafe.placeid = placeid;
        newCafe.name = name;
        //newCafe.save(function (err, savedCafe) {
        //    console.log('err', err);
        //    console.log('savedCafe', savedCafe);
        //});

        caves[i] = newCafe;


        //console.log(name);
        //console.log(placeid);
        //console.log(rating);
        //console.log(adress);
    }
    return caves;

}

function getCafe(json) {
    obj = JSON.parse(json).result;
        var name = obj.name;
        var placeid = obj.place_id;

        var newCafe = new Cafe();
        newCafe.placeid = placeid;
        newCafe.name = name;
        
        //newCafe.save(function (err, savedCafe) {
        //    console.log('err', err);
        //    console.log('savedCafe', savedCafe);
        //});

        cafe = newCafe;
        newCafe.save(function (err, savedCafe) {
            console.log('err', err);
            console.log('savedCafe', savedCafe);
        });

        //console.log(name);
        //console.log(placeid);
        //console.log(rating);
        //console.log(adress);
    
    return newCafe;

}



function getRaces(req, res){
    var query = { };

    var result = Race.find(query)
                .populate('cafes');
    console.log(result);

    //result.exec((err, data) => {
    //    res.json(data);
    //});
    //if (req.query.pageSize && req.query.pageIndex) {
    //    result = result.byPage(req.query.pageSize, req.query.pageIndex);
    //}
}

function getUsers(req, res){
    var query = { };

    var result = User.find(query)
                .populate('users');
    console.log(result);

    //result.exec((err, data) => {
    //    res.json(data);
    //});
    //if (req.query.pageSize && req.query.pageIndex) {
    //    result = result.byPage(req.query.pageSize, req.query.pageIndex);
    //}
}

module.exports = router;

