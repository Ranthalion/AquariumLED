var redis = require('redis');
var db = redis.createClient();

setInterval(function(){
	console.log('Master is publishing an LED Change event');
	db.publish('led_change', '{r:3,g:65,b:34}');
	}, 1000);
