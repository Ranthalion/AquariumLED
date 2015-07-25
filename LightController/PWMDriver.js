//TODO: Get rid of db access for gets and sets.
//TODO: Initial values should be passed to this module
//TODO:  and any changes should be recorded somewhere else

//var DAL = require('BLL/DAL');

var pca9685 = null;


if (require('os').type() == 'Linux') {
    pca9685 = require('./pca9685');
}
else {
    console.log('Creating pca9685 emulation.');
    pca9685 = function (address){
        return {
            setChannel: function (channel, value){
                console.log('Setting ' + channel + ' to ' + value);
            },
            reset: function () { 
                console.log('reset');
            },
            allOff: function (){
                console.log('all off');
            },
            allOn: function () {
                console.log('all on');
            },
            setPWMFreq: function (freq) { 
                console.log('Setting frequency to ' + freq);
            },
            setPWM: function (pin, on, off) {
                console.log('Setting pwm on pin ' + pin + '. On: ' + on + 'Off: ' + off);
            },
            setChannel: function (pin, val) {
                console.log('Setting channel ' + pin + ' to ' + val);
            },
            channelOn: function (pin) { 
                console.log('Channel ' + pin + ' turned on');
            },
            channelOff: function (pin) { 
                console.log('Channel ' + pin + ' turned off');
            }
        }
    };
}

var moment = require('moment');
var redis = require('redis');

//Initialize pwm on i2c address 0x64
var pwm = pca9685(0x64);

var client = redis.createClient();
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

console.log('Resetting all channels to 0.');

pwm.allOff();
pwm.reset();