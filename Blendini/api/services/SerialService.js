var port = null;
var callback = null;
var request = require('request');

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
	var msg = convert(data);
	var utcDate = new Date().toISOString();
	//sails.log.debug(utcDate + ' :' + msg);
	//TODO: [ML] Check for PH, temperature, or Leak warning. 
	//convert might not work out.  I might need to move it all to string since 13 and 10 show in brackets...  Maybe just remove it...

	if (msg.startsWith('T'))
	{
		var temperature = {
			timestamp: utcDate,
			probe: parseInt(msg[1], 10),
			temperature: parseFloat(msg.substring(3))
		};
		
		request.post({
		  headers: {'content-type' : 'application/json'},
		  url:     'https://70dg60pln0.execute-api.us-east-1.amazonaws.com/prod/temperature',
		  body:    JSON.stringify(temperature)
		}, function(error, response, body){
		  	if (error){
				console.log('Error: ', error);
			}
		});

	}
	else if (msg.startsWith('PH '))
	{
		var ph = {
			timestamp: utcDate,
			probe: 1,
			ph: msg.substring(3, 7)/1000
		};
		
		request.post({
		  headers: {'content-type' : 'application/json'},
		  url:     'https://70dg60pln0.execute-api.us-east-1.amazonaws.com/prod/phReading',
		  body:    JSON.stringify(ph)
		}, function(error, response, body){
			if (error){
				console.log('Error: ', error);
			}
		});
		
	}
	else if (msg == 'LEAK DETECTED')
	{
		sails.log.debug('Leak detected.  Send alert');
	}
	else if (callback != null){
		callback(data);
		callback = null;
	}
	else{

		sails.log.debug('Unknown Message: ' + msg);
	}

});

function convert(data){
	var str = '';
	for(i=0; i< data.length; i++){
		if (data[i] >= 32 && data[i] <140){
			str+=String.fromCharCode(data[i]);
		}
		else{
			str += '[' + data[i] + ']';
		}
	}
	return str;
}


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
