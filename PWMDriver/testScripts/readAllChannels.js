var args = process.argv.slice(2);

var serialport = require('serialport');
var port = new serialport('/dev/ttyS0', {
  parser: serialport.parsers.byteDelimiter([13, 10])
});	

port.on('open', function() {
  var channel = parseInt(args[0]) & 0xff;
  var buf = new Buffer(2);
  buf[0] = 'r'.charCodeAt();
  buf[1] = '\r'.charCodeAt();
  port.write(buf);
});

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
  process.exit(1);
});

port.on('data', function(data){
  console.log('msg: ', data.splice(1, 6).join(','));
  process.exit(0);
});


