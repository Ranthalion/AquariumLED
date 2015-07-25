var rasp2c = require('rasp2c');

module.exports = function(address){

	var addr = 0x64;
	if (address){
		addr = address;
	}
    
    var PCA9685_MODE1 = 0x0;
	var PCA9685_PRESCALE = 0xFE;
    
    var BASE_LED_ADDR = 0x06;
	var ALL_LED_ADDR = 0xFA;
	
	function write_cb(err, result){
		if (err){
			console.log('ERROR: ');
			console.log(err);
		}
	}
	
	function reset(){
		rasp2c.set(addr, PCA9685_MODE1, 0x0, write_cb);
	}

	function setPWMFreq(freq) {
		freq *= 0.9;
		var prescaleval = 25000000;
		prescaleval /= 4096;
		prescaleval /= freq;
		prescaleval -= 1;
		  
		prescale = Math.floor(prescaleval + 0.5);
		
		rasp2c.dump(addr, PCA9685_MODE1, function(err, result){
			if (err){
				
			}
			else{
				var oldmode = result;
				var newmode = (oldmode&0x7F) | 0x10; // sleep
				rasp2c.set(addr, PCA9685_MODE1, newmode, write_cb); // go to sleep
				rasp2c.set(addr, PCA9685_PRESCALE, prescale, write_cb); // set the prescaler
				rasp2c.set(addr, PCA9685_MODE1, oldmode, write_cb);
				setTimeout(function(){
					rasp2c.set(addr, PCA9685_MODE1, oldmode | 0xa1, write_cb);  
				}, 50);
			}
		});
												  
    }
    
    function setAll(on, off){
        var off = 4096 * val;
        var data_addr = ALL_LED_ADDR;
        rasp2c.set(addr, data_addr++, 0, write_cb);
        rasp2c.set(addr, data_addr++, 0, write_cb);
        rasp2c.set(addr, data_addr++, off & 0xFF, write_cb);
        rasp2c.set(addr, data_addr++, off >> 8, write_cb);
    }
	
    function allOn(){
        setAll(1);
	}
	
    function allOff(){
        setAll(0);
	}
	
	function pinOn(pin){
		setPWM(pin, 4096, 0);
	}
	
	function pinOff(pin){
		setPWM(pin, 0, 4096);
	}
	
	function setPin(pin, val){
		if ((pin < 0) || (pin > 15)){
			throw new Error('pin must be between 0 and 15.');
		}
		if ((val < 0) || (val > 100)){
			throw new Error('val should be a percentage between 0 and 100.');
		}
		if (val > 1){
			val/=100;
		}
		setPWM(pin, 0, 4095 * val);
	}
	
	function setPWM(pin, on, off){
		var data_addr = (pin*4) + BASE_LED_ADDR;
		rasp2c.set(addr, data_addr++, on & 0xFF, write_cb);
		rasp2c.set(addr, data_addr++, on >> 8, write_cb);
		rasp2c.set(addr, data_addr++, off & 0xFF, write_cb);
		rasp2c.set(addr, data_addr++, off >> 8, write_cb);
	}
	
	return {
		reset: reset,
		setPWMFreq: setPWMFreq,
		setPWM: setPWM,
		setChannel: setPin,
		channelOn: pinOn,
		channelOff: pinOff,
		allOff: allOff,
		allOn: allOn
	};
	
}