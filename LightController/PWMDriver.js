//TODO: Get rid of db access for gets and sets.
//TODO: Initial values should be passed to this module
//TODO:  and any changes should be recorded somewhere else

//var DAL = require('BLL/DAL');

var pca9685 = require('./pca9685');
var moment = require('moment');
var redis = require('redis');

//Initialize pwm on i2c address 0x64
var pwm = pca9685(0x64);

//Initialize after delay to allow i2c time to start
setTimeout(function () {
    console.log('Resetting all channels to 0.');
    pwm.allOff();
    pwm.setPWMFreq(1200);
    pwm.reset();

    //TODO: Read the current mode to determine if it is manual or auto
    // if it is manual, just read the channel settings and fade to those
    // otherwise, if it is auto, then read the schedule to find the right color and fade to it
}, 1000);


var db = redis.createClient();
db.subscribe('led_change');

db.on('message', function (channel, message){
    //TODO: Ignore duplicate or rapid fire messages.
	console.log(moment().format('h:mm:ss a') + ': ' + channel + '-' + message);
	message = JSON.parse(message);
	if (!message.channels){
		console.log('Bad message received.');
		return;
	}
	var channels = message.channels;
	var output = '';
	for(var i = 0; i < channels.length; i++){
		output += channels[i] + ' ';
		pwm.setChannel(i,channels[i]);
	}
	console.log('Channel: ' + output);
});
