/**
 * SettingsController
 *
 * @description :: Server-side logic for managing settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
  /**
   * `SettingsController.channels()`
   */
  channels: function (req, res) {
	
  	Channel.find().exec(function cb(err, channels){
  		if (channels.length == 6){
  			return res.view({channels: channels});
  		}
  		else {
  			Channel.destroy().exec(function cb(){});
  			var channels = new Array();
  			for(var i = 0; i < 6; i++){
  				channels[i] = {color: 'not defined', value: 0} 
  			}
  			Channel.create(channels).exec(function createdCallback(err, chans){
  				return res.view({channels: chans});
  			});
  		}
  	});
  	
  }

};

