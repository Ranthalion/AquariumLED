var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , DAL = require('BLL/DAL');

var DirectController = new Controller();

DirectController.index = function() {
  var db = new DAL();
  var view = this;
  this.settings = db.getCurrentSetting(function(err, setting){
    view.title = 'Direct Control';
    view.setting = setting;
	view.render();
  });
}

DirectController.update = function() {
	console.log(this.req.body);
	
	var db = require('redis').createClient();
	db.publish('led_change', JSON.stringify(this.req.body));
	db.quit();
	var request = this.req.body;
	var db = new DAL();
	db.getCurrentSetting(function(err, setting){
		if (err)
			throw new Error(err);
		for(var i = 0; i < request.length; i++)
			setting[i].value = request[i];
		console.log('In Controller, saving settings.');
		db.saveCurrentSetting(setting);
		db.quit();
	});
	this.res.json({result:'success'});
}

module.exports = DirectController;
