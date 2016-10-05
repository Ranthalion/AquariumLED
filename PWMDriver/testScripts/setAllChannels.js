var args = process.argv.slice(2);

var serialport = require('serialport');
var port = new serialport('/dev/ttyS0', {
	parser: serialport.parsers.byteDelimiter([13,10])
});	


port.on('open', function() {
  var val = parseInt(args[0] & 0xff);
  var buf = new Buffer(4);
  buf[0] = 'a'.charCodeAt();
  buf[1] = val;
  buf[2] = '\r'.charCodeAt();
  buf[3] = '\n'.charCodeAt();
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


