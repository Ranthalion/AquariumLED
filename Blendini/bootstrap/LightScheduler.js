var Cron = require('cron');
var SerialPort = null;
var parser = null;

try{
	SerialPort = require('serialport').SerialPort;
	parser = serialport.parsers.readline('\n');
}
catch(e){
	console.log('Serial port not found. Switching to emulation mode.');
	SerialPort = function(){
		return {
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
			}
		}
	};
}

// Private
var _jobs = [];

function fadeLights(channels){
	sails.log.debug('Executing Fade Lights');
	sails.log.debug(channels);
	port.write('f'  + channels.join(',') + '\r\n');
};

var port = new SerialPort('/dev/ttyAMA0', {
	parser: parser
});

// Public
var self = module.exports = {

	start: function start(){
		
		Schedule.find({}).populate('transitions').exec(function findCB(err, schedules){
			if (err){
				console.log('Error getting schedules: ' + err);
				return;
			}
			var transitions = schedules[0].transitions;

			if (transitions != null && transitions.length > 0){
				

				transitions.forEach(function(transition){
					var hour = transition.time.getHours();
					var minute = transition.time.getMinutes();
					var second = transition.time.getSeconds();
					var cronTime = second + " " + minute + " " + hour + " * * *";
					sails.log.debug('Loading ' + cronTime + ' ' + transition.values);
					
					var job = new Cron.CronJob(cronTime, function(){fadeLights(transition.values);}, null, true, null);
					_jobs.push(job);
					});
				}
			});
			
	},
	
  	clear: function clear(){
  		for(var i = 0; i < _jobs.length; i++){
  			_jobs[i].stop();
  		}
  	}, 

  	getCurrentValues: function getCurrentValues(cb){
  		port.write('r\r\n');
  		port.on('data', function(data){
  			port.on('data', null);
  			if (cb != null){
  				cb(data.substr(1).split(','));
  			}
  		});
  	},

  	setChannel: function setValue(pin, value){
  		port.write('s' + pin + 'v' + value + '\r\n');
  	}

};
