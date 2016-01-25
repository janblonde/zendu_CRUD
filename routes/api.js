var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Location = require('../models/location.js');
var User = require('../models/user.js');
var Brief = require('../models/brief.js');
var bcrypt = require('bcrypt-nodejs');

router.get('/',function(req,res){
    res.send('Welcome to the API zone');
});

//LOCATION
router.get('/location', sessionCheck, function(req,res){
    Location.find(function(err, locations){
        if(!err){
            res.send(locations);
        }else{
            res.send(500,err);
        }
    })
});

router.post('/location', sessionCheck, function(req,res){
    var location = new Location({
        displayName: req.body.displayName,
        displayLastName: req.body.lastName,
        date: new Date(Date.now())
    });
    
    location.save(function(err){
        if(!err){
            return res.send(200,location);
        }else{
            return res.send(500,err);
        }
    });
});

router.put('/location', sessionCheck, function(req,res){

    Location.update({
        _id:req.body.id
    },{
        $set: {
        displayName: req.body.displayName,
        displayLastName: req.body.lastName,
        date: new Date(Date.now())
        }
    }).exec();
    res.send("Location updated");
});

router.delete('/location/:id', sessionCheck, function(req,res){
    
    Location.remove({
        _id: req.params.id
    }, function(err){
        if(err)
            console.log("ERROR:" + err);
    });
    res.send("Location id:" + req.params.id + " has been deleted");
});

//BRIEVEN
router.get('/brief', sessionCheck, function(req,res){
    Brief.find(function(err, data){
        if(!err){
            res.send(data);
        }else{
            res.send(500,err);
        }
    })
});

router.post('/brief', sessionCheck, function(req,res){
    var brief = new Brief({
        destinationLastName: req.body.destinationlastname,
        destinationFirstName: req.body.destinationfirstname,
        createdAt: new Date(Date.now())
    });
    
    brief.save(function(err){
        if(!err){
            return res.send(200,brief);
        }else{
            return res.send(500,err);
        }
    });
});

router.put('/brief', sessionCheck, function(req,res){

    Brief.update({
        _id:req.body.id
    },{
        $set: {
        destinationLastName: req.body.destinationlastname,
        destinationFirstName: req.body.destinationfirstname
        }
    }).exec();
    res.send("Brief updated");
});

router.delete('/brief/:id', sessionCheck, function(req,res){
    
    Brief.remove({
        _id: req.params.id
    }, function(err){
        if(err)
            console.log("ERROR:" + err);
    });
    res.send("Brief id:" + req.params.id + " has been deleted");
});

//admin routes

router.post('/add-user', function(req,res){
    var salt, hash,password;
    password = req.body.password;
    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password,salt);
    
    var user = new User({
        email: req.body.username,
        password: hash
    });
    
    user.save(function(err){
        if(!err){
            res.send("Admin user successfully created");
        }else{
            res.send(err);
        }
    });
});

router.post('/login', function(req,res){
    var email = req.body.username;
    var password = req.body.password;
    
    User.findOne({
        email: email
    },function(err,data){
        if(err || data === null){
            res.send(401, "User doesn't exist");
        }else{
            if(bcrypt.compareSync(password, data.password)){
                req.session.regenerate(function(){
                    req.session.user = email;
                    res.send(email);
                });
            }else{
                res.send(401, "Bad Username or Password");
            }
        }
    });
});

router.get('/logout', function(req,res){
    req.session.destroy(function(){
        res.send(401, "User logged out");
    });
});

function sessionCheck(req,res,next){
    if(req.session.user) next();
    else res.send(401,"Authorization failed");
}

module.exports = router;