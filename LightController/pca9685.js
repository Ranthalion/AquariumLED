

module.exports = function(address){
    var rasp2c = null;
    try {
        rasp2c = require('rasp2c');
    }
    catch (ex) {
        console.log('rasp2c is not available on this system.  Using emulation mode instead.');
        var channels = [0, 0, 0, 0, 0, 0];
        return {

            setChannel: function (channel, value) {
                console.log('Setting ' + channel + ' to ' + value);
                channels[channel] = value;
            },
            reset: function () {
                console.log('reset');
            },
            allOff: function () {
                console.log('all off');
                for(var i = 0; i < channels.length; i++)
                    channels[i] = 0;
            },
            allOn: function () {
                console.log('all on');
                for (var i = 0; i < channels.length; i++)
                    channels[i] = 1;
            },
            setPWMFreq: function (freq) {
                console.log('Setting frequency to ' + freq);
            },
            setPWM: function (pin, on, off) {
                console.log('Setting pwm on pin ' + pin + '. On: ' + on + 'Off: ' + off);
                channels[pin] = ((off - on) / 4095);
            },
            setChannel: function (pin, val) {
                console.log('Setting channel ' + pin + ' to ' + val);
                channels[pin] = val;
            },
            channelOn: function (pin) {
                console.log('Channel ' + pin + ' turned on');
                channels[pin] = 1;
            },
            channelOff: function (pin) {
                console.log('Channel ' + pin + ' turned off');
                channels[pin] = 0;
            },
            readPin: function (pin, cb) {
                console.log('Reading channel ' + pin + '.');
                if (cb) {
                    cb(channels[pin]);
                }
                else {
                    console.log(channels[pin]);
                }
            },
            fadeTo: function (pin, val) {
                console.log('Fading channel ' + pin + ' to ' + val);
            }
        };
    }

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
	
	function fadeTo(channel, val){
		readPin(channel, function(start){
			fadeChannel(channel, start, val, .001, 500);
		});
	}
	
	function fadeChannel(channel, start, end, step, speed){
		if (start < end){
			start+=step;
			setPin(channel, start);
			if (start < end){
				setTimeout(function(){fadeChannel(channel, start, end, step, speed);}, speed);
			}
		}
		else{
			start-=step;
			setPin(channel, start);
			if (start > end){
				setTimeout(function(){fadeChannel(channel, start, end, step, speed);}, speed);
			}			
		}
	}
	
	function reset(){
		rasp2c.set(addr, PCA9685_MODE1, 0x0, write_cb);
	}

	function setPWMFreq(freq) {
		freq *= 0.9;
		var prescale = 25000000;
		prescale /= 4096;
		prescale /= freq;
		prescale -= 1;
		  
		prescale = Math.floor(prescale + 0.5);
		rasp2c.dump(addr, PCA9685_MODE1 + '-' + PCA9685_MODE1, function(err, result){
			if (err){
				
			}
			else{
				var oldmode = parseInt(result);
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
        setAll(0, 1);
	}
	
    function allOff(){
        setAll(0, 0);
	}
	
	function pinOn(pin){
		setPWM(pin, 4096, 0);
	}
	
	function pinOff(pin){
		setPWM(pin, 0, 4096);
	}
	
	function readPin(pin, callback){
		var startAddr = (pin*4) + BASE_LED_ADDR;
		var endAddr = startAddr + 3;
		rasp2c.dump(addr, startAddr + '-' + endAddr, function(err, val){
			if (err){
				console.log('Error: ' + err);
			}
			else{
				var on = (val[1] << 8) + val[0];
				var off = (val[3] << 8) + val[2];
                
                var pct = 0;
                if (on == 4096 && off == 0) {
                    pct = 1;
                }
                else if (on == 0 && off == 4096) {
                    pct = 0;
                }
                else {
                    pct = (off - on) / 4096;
                }
                
                if (callback) {
                    callback(pct);
                }
                else {
                    console.log(pct);
                }

			}
		});
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
		setPWM(pin, 0, Math.round(4095 * val));
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
		allOn: allOn,
		fadeChannel: fadeChannel,
		readPin: readPin,
		fadeTo: fadeTo
	};
	
}