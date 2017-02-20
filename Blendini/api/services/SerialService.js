var port = null;
var callback = null;

if (require('os').type() == 'Linux'){
	sails.log.debug('Serial detected in SerialService.');
	var serialport = require('serialport');
	var SerialPort = serialport.SerialPort;
	var devicePort = sails.config.blendini.serialPort;
	sails.log.debug('Starting on port ' + devicePort);

	//port = new SerialPort('/dev/ttyS0', {
	port = new SerialPort(devicePort, {
		parser: serialport.parsers.byteDelimiter([13, 10])
	});	
}
else{
	sails.log.debug('Serial port not found. Switching to emulation mode.');
	port = {
		write: function(buff){
			sails.log.debug('Serial Write: ' + buff);
		},
		on: function(event, cb){
			if (cb != null){
				sails.log.debug('setting on for ' + event + ' with cb: ' + cb);
				setTimeout(function(){
					cb('v100,200,399,400,500,600');
				}, 1000);
			}
		},
		removeListener: function(){}
	};
}

port.on('data', function(data){
	sails.log.debug('msg :' + data);
	if (callback != null){
		callback(data);
		callback = null;
	}
	else{
		sails.log.debug('  but callback was null');
	}

});

function write(buffer, cb){
	callback = null;
	if (cb){
		callback = cb;
	}
	port.write(buffer);
}

function writeLine(buffer, cb){
	callback = null;
	if (cb){
		callback = cb;
	}
	port.write(buffer);
	port.write('\r\n');
}

// Public
var self = module.exports = {

	write: write,
	writeLine: writeLine

};
