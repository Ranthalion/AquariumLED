var args = process.argv.slice(2);

var serialport = require('serialport');
var port = new serialport('/dev/ttyS0', {
	parser: serialport.parsers.readline('\r\n')
});	


port.on('open', function() {
  var channel = parseInt(args[0]) & 0xff;
  var val = parseInt(args[1] & 0xff);
  var buf = new Buffer(5);
  buf[0] = 's'.charCodeAt();
  buf[1] = channel;
  buf[2] = val;
  buf[3] = '\r'.charCodeAt();
  buf[4] = '\n'.charCodeAt();
  port.write(buf);
  process.exit(0);
});

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
});

port.on('data', function(data){
	console.log('msg: ', data);
});


