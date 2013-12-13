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
	
	var db = require('redis').createClient();
	db.publish('led_change', JSON.stringify(this.req.body));
	db.quit();
	var request = this.req.body;
	if (request.channels){
		var db = new DAL();
		db.getCurrentSetting(function currentSettingsCB(err, setting){
			if (err)
				throw new Error(err);
			
			for(var i = 0; i < request.channels.length; i++){
				setting[i].value = request.channels[i];
			}
			db.saveCurrentSetting(setting);
			db.quit();
		});
		this.res.json({result:'success'});
	}
	else{
		this.res.json({result:'failure'});
	}
}

module.exports = DirectController;
