var Cron = require('cron');
var port = null;


if (require('os').type() == 'Linux'){
	sails.log.debug('Serial detected.');
	var serialport = require('serialport');
	var SerialPort = serialport.SerialPort;
	port = new SerialPort('/dev/ttyS0', {
		parser: serialport.parsers.byteDelimiter([13, 10]);
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
});

// Private
var _jobs = [];

function fadeLights(channels){
	var buf = new Buffer(9);
	buf[0] = 'f';
	for(var i = 0; i < 6; i++){
		buf[i+1] = parseInt(channel[i]);
	}
	buf[7] = '\r';
	buf[8] = '\n';

	sails.log.debug('Executing Fade Lights');
	sails.log.debug(buf);

	port.write(buf);
};

// Public
var self = module.exports = {

	start: function start(){
		
		Schedule.find({}).populate('transitions').exec(function findCB(err, schedules){
			if (err){
				console.log('Error getting schedules: ' + err);
				return;
			}
			if (schedules != null && schedules.length > 0){
				var transitions = schedules[0].transitions;

				if (transitions != null && transitions.length > 0){

					
					transitions.forEach(function(transition){
						
						var hour = transition.time.getHours();
						var minute = transition.time.getMinutes();
						var second = transition.time.getSeconds();
						var cronTime = second + " " + minute + " " + hour + " * * *";
						sails.log.debug('Loading ' + cronTime + ' ' + transition.values);
						
						var job = new Cron.CronJob(cronTime, function(){
							sails.log.debug('In CRON callback');
							fadeLights(transition.values);
						}, null, true, null);
						_jobs.push(job);
						});
					}
				}

			});			
	},
	
  	clear: function clear(){
  		for(var i = 0; i < _jobs.length; i++){
  			_jobs[i].stop();
  		}
  	}, 

  	getCurrentValues: function getCurrentValues(cb){

  		var data_cb = function(data){
  			sails.log.debug('data :' + data);
  			port.removeListener('data', data_cb);
  			if (cb != null){
  				cb(data.splice(1,6));
  			}
  		};

  		sails.log.debug('Scheduler GetCurrentValues');
  		port.write('r\r\n');
  		port.on('data', data_cb);
  	},

  	setChannel: function setValue(pin, value){
  		sails.log.debug('s'+ pin  + 'v' + value);
  		var buf = new Buffer(5);
  		buf[0] = 's'.charCodeAt();
  		buf[1] = pin;
  		buf[2] = value;
  		buf[3] = '\r'.charCodeAt();
  		buf[4] = '\n'.charCodeAt();
  		port.write(buf);
  	}

};
