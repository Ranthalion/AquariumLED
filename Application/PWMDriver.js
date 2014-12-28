//TODO: Get rid of db access for gets and sets.
//TODO: Initial values should be passed to this module
//TODO:  and any changes should be recorded somewhere else

//var DAL = require('BLL/DAL');

var pwm = null;

//Initialize PWM or emulate
try{
	pwm = require('pi-blaster.js');
}
catch(e){
	console.log('PWM via pi-blaster is not found.');
	if (require('os').type() == 'Linux'){
		throw(e);
	}else{
		console.log('Creating PWM emulation.');
		pwm = {setPwm: function(channel, value){
				console.log('Setting ' + channel + ' to ' + value);
			}
		};
	}
}

var piPins = [4, 18, 17, 24, 22, 23];
var moment = require('moment');
var redis = require('redis');

var client = redis.createClient();
var db = redis.createClient();
db.subscribe('led_change');

db.on('message', function(channel, message){
	console.log(moment().format('h:mm:ss a') + ': ' + channel + '-' + message);
	//TODO: parse the message, but discard it if it is bad.
	message = JSON.parse(message);
	if (!message.channels){
		console.log('Bad message received.');
		return;
	}
	var channels = message.channels;
	var output = '';
	for(var i = 0; i < channels.length; i++){
		output += channels[i] + ' ';
		pwm.setPwm(piPins[i],channels[i]);
	}
	console.log('Channel: ' + output);
});

console.log('Resetting all channels to 0.');

for (var i = 0; i < 6; i++)
	pwm.setPwm(piPins[i],0);
	
/*
var db = new DAL();
db.getCurrentSetting(function(err, settings){
	console.log('Settings channels from saved settings.');

	if (settings){
		for(var i = 0; i < settings.length; i++){
			pwm.setPwm(piPins[i], settings[i].value);
		}
	}
	else {
		settings = [];
	}
});
db.quit();
*/