var pca = require('/home/pi/aquarium/AquariumLED/pca9685');
var pwm = pca(0x64);
setTimeout(function(){
	pwm.channelOff(0);
	pwm.channelOff(1);
	pwm.channelOff(2);
	pwm.channelOff(3);
	pwm.channelOff(4);
	pwm.channelOff(5);
}, 1000);