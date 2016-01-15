var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Page = require('../models/page.js');
var Location = require('../models/location.js');
var AdminUser = require('../models/admin-users.js');
var bcrypt = require('bcrypt-nodejs');

router.get('/',function(req,res){
    res.send('Welcome to the API zone');
});

router.get('/location', function(req,res){
    Location.find(function(err, locations){
        if(!err){
            res.send(locations);
        }else{
            res.send(500,err);
        }
    })
});

router.post('/location', function(req,res){
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

router.put('/location', function(req,res){

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

router.delete('/location/:id', function(req,res){
    
    Location.remove({
        _id: req.params.id
    }, function(err){
        if(err)
            console.log("ERROR:" + err);
    });
    res.send("Location id:" + req.params.id + " has been deleted");
});

router.get('/pages',function(req,res){
    Page.find(function(err,pages){
        if(!err){
            res.send(pages);
        }else{
            res.send(500, err);
        }
    })
});

router.post('/pages/add', sessionCheck, function(req,res){
    var page = new Page({
        title: req.body.title,
        url: req.body.url,
        content: req.body.content,
        menuIndex: req.body.menuIndex,
        date: new Date(Date.now())
    });
    
    page.save(function(err){
        if(!err){
            return res.send(200,page);
        }else{
            return res.send(500,err);
        }
    });
});

router.post('/pages/update', sessionCheck, function(req,res){
    
    Page.update({
        _id:req.body._id
    },{
        $set: {
        title: req.body.title,
        url: req.body.url,
        content: req.body.content,
        menuIndex: req.body.menuIndex,
        date: new Date(Date.now())
        }
    }).exec();
    res.send("Page updated");
});

router.get('/pages/delete/:id', sessionCheck, function(req,res){

    Page.remove({
        _id: req.params.id
    }, function(err){
        console.log(err);
    });
    res.send("Page id:" + req.params.id + " has been deleted");
});

router.get('/pages/admin-details/:id', sessionCheck, function(req,res){
    
    Page.findOne({
        _id: req.params.id
    },function(err,page){
        if (err)
            console.log(err);
        res.send(page);
    })
});

router.get('/pages/details/:url', function(req,res){
    Page.findOne({
        url: req.params.url
    },function(err,page){
        if (err)
            console.log(err);
        res.send(page);
    })
});

//admin routes

router.post('/add-user', function(req,res){
    var salt, hash,password;
    password = req.body.password;
    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password,salt);
    
    var adminUser = new AdminUser({
        username: req.body.username,
        password: hash
    });
    
    adminUser.save(function(err){
        if(!err){
            res.send("Admin user successfully created");
        }else{
            res.send(err);
        }
    });
});

router.post('/login', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    
    AdminUser.findOne({
        username: username
    },function(err,data){
        if(err || data === null){
            res.send(401, "User doesn't exist");
        }else{
            if(bcrypt.compareSync(password, data.password)){
                req.session.regenerate(function(){
                    req.session.user = username;
                    res.send(username);
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