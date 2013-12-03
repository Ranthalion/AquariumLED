var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var ScheduleController = new Controller();

ScheduleController.main = function() {
  this.title = 'Schedule Visualizer';
  this.render();
}

module.exports = ScheduleController;
