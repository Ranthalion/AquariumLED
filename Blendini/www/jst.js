this["JST"] = this["JST"] || {};

this["JST"]["assets/templates/ChannelSetting.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'well\' style=\'background:rgb({{setting.red}},{{setting.green}},{{setting.blue}}); color: {{getTextColor(setting.red, setting.green, setting.blue)}};\'>\r\n\t<form name="form_{{$id}}" novalidate>\r\n\t\t<h4 class=\'text-center\'>Port {{setting.port}}</h4>\t\t  \t\t\r\n\t\t<label for=\'color_{{$id}}\'>Color</label>\r\n\t\t<input type=\'text\' class=\'form-control\' id=\'color_{{$id}}\' ng-model=\'setting.color\' />\r\n\t\t<div class=\'row hidden-sm hidden-xs mt10\'>\r\n\t\t\t<div class=\'col-md-4 text-center\'>R</div>\r\n\t\t\t<div class=\'col-md-4 text-center\'>G</div>\r\n\t\t\t<div class=\'col-md-4 text-center\'>B</div>\r\n\t\t</div>\r\n\t\t<div class=\'row\'>\r\n\t\t\t<div class=\'col-md-4\'>\r\n\t\t\t<label class=\'visible-sm visible-xs mt10\'>R</label>\r\n\t\t\t<input type=\'number\' min=\'0\' max=\'255\' class=\'form-control\' id=\'red_{{$id}}\' ng-model=\'setting.red\'>\r\n\t\t\t</div>\r\n\t\t\t<div class=\'col-md-4\'>\r\n\t\t\t<label class=\'visible-sm visible-xs mt10\'>G</label>\r\n\t\t\t\t<input type=\'number\' min=\'0\' max=\'255\' class=\'form-control\'  id=\'green_{{$id}}\' ng-model=\'setting.green\'>\r\n\t\t\t</div>\r\n\t\t\t<div class=\'col-md-4\'>\r\n\t\t\t<label class=\'visible-sm visible-xs mt10\'>B</label>\r\n\t\t\t\t<input type=\'number\' min=\'0\' max=\'255\' class=\'form-control\'  id=\'blue_{{$id}}\' ng-model=\'setting.blue\'>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</form>\r\n</div>';

}
return __p
};