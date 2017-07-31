var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

router.get('/deleteuser', function(req, res){
	var db = req.db;
	var title = req.query.username;
	var collection = db.get('usercollection');
	collection.remove({"usernames":title},function(err,doc){
		if(err){
		   // If it failed, return error
            res.send("There was a problem deleting the information to the database.");
		}  else {
            // And forward to success page
            res.redirect("userlist");
        }	
	});
});


// Route to user registration page
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* GET User from MongoDB */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){	
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

router.get('/settinguser',function(req,res){
	res.render('settinguser', { title: 'Update user info' });
});	

// Receive POST user details.
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
	
    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }		
    });
});

router.post('/updateuser', function(req, res) {
	var db = req.db;
	
	var userName = req.body.username;
	var userEmail = req.body.useremail;
	
	var collection = db.get('usercollection');
	
	collection.update(
		{'username': userName},
		{$set:{'email': userEmail}},
		{multi:true}, 
		function(err, doc){
			if(err){
				// If it failed, return error
				res.send("There was a problem updating the information to the database.");
			}
			else {
				 // And forward to success page
				res.redirect('userlist');
			}
	});
});
	

module.exports = router;
