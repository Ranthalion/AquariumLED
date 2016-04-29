/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  	// It's very important to trigger this callback method when you are finished
  	// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  	var Scheduler = require('../bootstrap/LightScheduler');
  	//var scheduler = new Scheduler();
  	
  	SystemState.count().exec(function(err, cnt){
  		if (cnt != 1){
  			SystemState.destroy().exec(function cb(){});
  			var state = {mode: 'schedule'};
  			SystemState.create(state).exec(function createdCallback(err, state){
				if (!err)
  					sails.log.verbose('System state created.');
  				else
  					sails.log.verbose('Error: ' + err);
  			});
  		}
  		Scheduler.start();
  	});

  	sails.log.verbose('Checking channel count');
  	Channel.count().exec(function cb(err, cnt){
		sails.log.verbose('count = ' + cnt);
		
		//Schedule.destroy().exec(function destroycb(){});

		if (cnt != 6){
	  	
	  		sails.log.verbose('Resetting channels since count was ' + cnt);
			Channel.destroy().exec(function cb(){});
			var channels = new Array();
			for(var i = 0; i < 6; i++){
				channels[i] = {color: 'not defined', value: 0, port: i} 
			}
			Channel.create(channels).exec(function createdCallback(err, chans){
				sails.log.verbose('Created channels');
				sails.log.verbose(chans);

			});
		}
	});

	cb();

};
