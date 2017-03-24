/**
 * ConsoleController
 *
 * @description :: Server-side logic for console debugging
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	clear: function(req, res){
		
		sails.log.debug('Clearing calibration');
		SerialService.writeLine('c');
		return res.ok('clear calibration complete');

	}, 

	setLow: function(req, res){
		
		sails.log.debug('Calibrating Low');
		SerialService.writeLine('l');
		return res.ok('low ph calibration complete');
		
	},

	setMid: function(req, res){
		
		sails.log.debug('Calibrating Mid');
		SerialService.writeLine('m');
		return res.ok('mid ph calibration complete');
		
	},

	setHigh: function(req, res){
		
		sails.log.debug('Calibrating High');
		SerialService.writeLine('h');
		return res.ok('high ph calibration complete');
		
	},

	setTemperature: function(req, res){
		
		sails.log.debug('Temperature Compensation not implemented');
		return res.serverError('Set temperateure not implemented');
		
	}
};
