/**
 * DirectController
 *
 * @description :: Server-side logic for managing directs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Scheduler = require('../../bootstrap/LightScheduler');

module.exports = {
	
  current: function(req, res){
    sails.log.debug('getting current settings');
    Scheduler.getCurrentValues(function(values){
      return res.json(values);
    });
  },

  setChannel: function(req, res){
    var request = req.allParams();
    Scheduler.setChannel(request.channel, request.value);
    return res.ok();
  },

  setMode: function(req, res){
    if (req.mode == 'direct'){
      Scheduler.clear();
    }
    else{
      Scheduler.start();
    }
  },

  /**
   * `DirectController.index()`
   */
  index: function (req, res) {
    return res.json({
      todo: 'index() is not implemented yet!'
    });
  },


  /**
   * `DirectController.setMode()`
   */
  setMode: function (req, res) {
    return res.json({
      todo: 'setMode() is not implemented yet!'
    });
  },


  /**
   * `DirectController.update()`
   */
  update: function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  }
};

