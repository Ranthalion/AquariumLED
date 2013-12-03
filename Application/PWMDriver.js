var pwm = require('pi-blaster.js');

var piPins = [4, 18, 17, 24, 22, 23];

var redis = require('redis');
var db = redis.createClient();
db.subscribe('led_change');
db.on('message', function(channel, message){
	console.log(new Date());
	console.log(channel + ': ' + message);
	var channels = JSON.parse(JSON.parse(message).channels);
	for(var i = 0; i < channels.length; i++){
		console.log('Channel ' + i + ': ' + channels[i]);
		pwm.setPwm(piPins[i],channels[i]);
	}
});

for (var i = 0; i < 6; i++)
	pwm.setPwm(piPins[i],0);