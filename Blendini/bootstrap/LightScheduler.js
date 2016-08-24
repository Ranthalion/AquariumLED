var Cron = require('cron');
var port = null;


if (require('os').type() == 'Linux'){
	sails.log.debug('Serial detected.');
	var serialport = require('serialport');
	var SerialPort = serialport.SerialPort;
	port = new SerialPort('/dev/ttyAMA0', {
		parser: serialport.parsers.readline('\r\n')
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
	sails.log.debug('Executing Fade Lights');
	//Write z to reset the pca9685 to ensure that PWM is enabled.
	port.write('z\r');
	var command = 'f'  + channels.join(',');
	sails.log.debug(command);
	port.write(command + '\r');
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
				//push a reset job for noon every day
				_jobs.push(new Cron.CronJob('0 0 12 * * *', function(){
					port.write('z\r');
				}, null, true, null));
				//push a reset job for just after noon every day
				_jobs.push(new Cron.CronJob('0 5 12 * * *', function(){
					port.write('z\r');
				}, null, true, null));
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
  				cb(data.substr(1).split(','));
  			}
  		};

  		sails.log.debug('Scheduler GetCurrentValues');
  		port.write('r\r');
  		port.on('data', data_cb);
  	},

  	setChannel: function setValue(pin, value){
  		sails.log.debug('s'+ pin  + 'v' + value);
  		port.write('s' + pin + 'v' + value + '\r');
  	}

};
