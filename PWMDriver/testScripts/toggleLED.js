var args = process.argv.slice(2);
console.log("args: ", args);

var serialport = require('serialport');
var port = new serialport('/dev/ttyS0', {
	parser: serialport.parsers.readline('\r\n')
});	

console.log('set up serial');

port.on('open', function() {
  port.write(args[0] + '\r');
  process.exit(0);
});

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
	process.exit(1);
});

port.on('data', function(data){
	console.log('msg: ', data);
	process.exit(0);
});


