var args = process.argv.slice(2);

var serialport = require('serialport');
var port = new serialport('/dev/ttyS0', {
	parser: serialport.parsers.byteDelimiter([13, 10])
});	


port.on('open', function() {

  var buf = new Buffer(args.length+3);
  buf[0] = 'f'.charCodeAt();
  for(var i = 0; i<args.length; i++){
    buf[i+1] = args[i];
  }
  buf[args.length+1] = '\r'.charCodeAt();
  buf[args.length+2] = '\n'.charCodeAt();
  console.log(buf);
  port.write(buf);
  process.exit(0);
});

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
});

port.on('data', function(data){
  var txt = new Buffer(data);
});


