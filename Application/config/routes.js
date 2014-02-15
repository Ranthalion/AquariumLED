// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
module.exports = function routes() {
  this.root('direct#index');
  this.match('direct/update', 'direct#update', {via: 'POST'});
  this.match('direct/setMode', 'direct#setMode', {via: 'POST'});
  this.match('settings/channels', 'settings#channels', {via: 'GET'});
  this.match('settings/channels', 'settings#savechannels', {via: 'POST'});
  this.match('schedule', 'pages#main');
}
