var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var DirectController = new Controller();

DirectController.index = function() {
  this.title = 'Direct Control';
  this.render();
}

DirectController.update = function() {
	console.log(this.req.body);
	var db = require('redis').createClient();
	db.publish('led_change', JSON.stringify(this.req.body));
	db.quit();
	this.res.json({result:'success'});
}

module.exports = DirectController;
