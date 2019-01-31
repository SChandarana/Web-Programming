"use strict";
const express = require('express');
const app = express();
const session = require('express-session');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:"concertina"}));
app.use(express.static('public'));


var users = [{"username":"doctorwhocomposer", "forename":"Delia", "surname":"Derbyshire"}];
var passwords = ["password"];
var comments = {
	"comments": [{
		"username":"doctorwhocomposer",
		"event": "Park Run",
		"comment":"Wowie I just can't wait for this park run!!"
	},
	{
		"username":"Shivam",
		"event": "Another event",
		"comment":"This event looks amazing"
	}]
};
var times = {};
var events = {
	"events": [{
		"name":"Park Run",
		"image": "https://d2tfd645274ffx.cloudfront.net/assets/parkrun/parkrun_logo-d258b02c8a9688689f6152182860d4b3aec4260c3dce74c2e6e57f719b97aa49.jpg",
		"tagline":"Wowie I just can't wait for this park run!!",
		"date": "7th Feb 2019"
	},
	{
		"name":"Another Event",
		"image": "https://d2tfd645274ffx.cloudfront.net/assets/goodgym_red-688adde9f7d011eb16c0cafa461d8f214e93fdefe2044d10f6cf68fee52c1584.png",
		"tagline":"This event looks amazing",
		"date":"7th Feb 2019"
	}]
};
var logged = false;

app.post('/people', function(req,resp){
	
	if (req.body.access_token != "concertina"){
		
		resp.send(403);
	} else if(findUser(req.body.username) !== false){
		
			resp.send(400);
		}else if(!req.body.username){}
		else{
			
			let user = {
				username: req.body.username,
				forename: req.body.forename,
				surname: req.body.surname,	
			};

			passwords.push(req.body.password);

			users.push(user);
			resp.send("Success")
		}
	})

app.get("/people", function(req,resp){
	resp.send(users);

})
app.get("/people/:username", function(req,resp){
	let index = findUser(req.params.username);
	if(index !== false){
		resp.send(users[index]);
	}else{
		resp.send("no user found");
	}

})

app.post("/login",function(req,resp){
	var index = findUser(req.body.username);
	if(!req.body.username || !req.body.password || index === false || passwords[index] != req.body.password ){
		resp.send(false);
	}else{
		resp.send(true);
		req.session.isLoggedin = true;
		req.session.save(function(err){});
	}
})

app.get("/logout",function(req,resp){
	req.session.destroy();
	resp.send(true);
})

app.get("/comments", function(req,resp){
	resp.send(comments);
})

app.get("/events", function(req,resp){
	resp.send(events);
})



app.get("/logged",function(req,resp){
	resp.send(checkLoggedin(req));
})

function checkLoggedin(req){
	if(req.session.isLoggedin){
		return true;
		
	}else{
		
		return false;
	}
}

function findUser(username){

	for (var i = 0; i < users.length; i++) {

		if (users[i].username == username){
			return i;
		}
	}
	return false
};
module.exports = app;	
