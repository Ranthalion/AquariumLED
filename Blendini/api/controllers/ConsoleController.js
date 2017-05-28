/**
 * ConsoleController
 *
 * @description :: Server-side logic for console debugging
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	sendChar: function(req, res){
		var char = req.param('char');
		sails.log.debug('sending char '  + char);

		var timeout = setTimeout(function(){
			return res.ok('No data recevied from mcu.');
		}, 1000);

		SerialService.writeLine(char, function(data){
			clearTimeout(timeout);
			return res.ok(data);	
		});
	}, 

	readAll: function(req, res){
		sails.log.debug('Read all');
		SerialService.writeLine('r', function(data){

			return res.ok('Channel values' + data);

		});		
	}, 

	readPhRegister: function(req, res){
		var address = req.param('address');
		sails.log.debug('reading address : ' + address);
		address = parseInt(address, 10);
		sails.log.debug('converted to number : ' + address);

		var timeout = setTimeout(function(){
			return res.ok('No data recevied from mcu.');
		}, 1000);
		
		SerialService.writeLine('x' + String.fromCharCode(address), function(data){
			clearTimeout(timeout);
			return res.ok(data);
		});


	}
};
