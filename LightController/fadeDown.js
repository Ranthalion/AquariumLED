var pca = require('/home/pi/aquarium/AquariumLED/pca9685');
console.log('Starting PCA');
var pwm = pca(0x64);
console.log('Setting Timeout');
setTimeout(function(){
	console.log('Starting fades');
	pwm.fadeTo(0, .001);
	pwm.fadeTo(1, .001);
	pwm.fadeTo(2, .001);
	pwm.fadeTo(3, .001);
	pwm.fadeTo(4, .001);
	pwm.fadeTo(5, .001);
}, 1000);
