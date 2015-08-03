var pca = require('/home/pi/aquarium/AquariumLED/pca9685');
var pwm = pca(0x64);
setTimeout(function(){
	pwm.reset();
	pwm.setChannel(0, .001);
	pwm.setChannel(1, .001);
	pwm.setChannel(2, .001);
	pwm.setChannel(3, .001);
	pwm.setChannel(4, .001);
	pwm.setChannel(5, .001);
	pwm.fadeTo(0, .6);
	pwm.fadeTo(1, .6);
	pwm.fadeTo(2, .6);
	pwm.fadeTo(3, .6);
	pwm.fadeTo(4, .6);
	pwm.fadeTo(5, .6);
}, 1000);
