var args = process.argv.slice(2);

var serialport = require('serialport');
var port = new serialport('/dev/ttyS0', {
	parser: serialport.parsers.byteDelimiter([13, 10])
});	


port.on('open', function() {
  var channel = parseInt(args[0]) & 0xff;
  var val = parseInt(args[1] & 0xff);

  var buf = new Buffer(args.length+2);
  buf[0] = 'i'.charCodeAt();
  for(var i = 0; i<args.length; i++){
    buf[i+1] = args[i];
  }
  buf[args.length+1] = '\r'.charCodeAt();

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


