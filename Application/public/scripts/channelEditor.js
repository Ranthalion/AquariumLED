(function($){
	$.widget('led.channelEditor',{
		// These options will be used as defaults
		options: { 
		  clear: null,
		  change: null,
		  channels: null
		},
		
		sliders: null,
		
		// Set up the widget
		_create: function() {
			var self = this;
			this.sliders = new Array();
			for (var i = 0; i < this.options.channels.length; i++)
				this.sliders[i] = this.createChannelBar(this.options.channels[i]);
		},
		
		createChannelBar: function(channel) {
			var div = $('<div>')
				.css('clear','both')
				.css('padding','15px 0px 15px 0px');
			div.append($('<div>')
				.text(channel.name)
				.css('float','left')
				.css('width','100px')
				.css('margin-right','15px'));
			var slider = $('<div>')
				.css('float', 'left')
				.css('width', '80%')
				.css('background', 'rgb(' + channel.color.r + ',' + channel.color.g + ',' + channel.color.b + ')')
				.slider({max:100, 
					slide: $.proxy(this._sliderChanged, this),
					change: $.proxy(this._sliderChanged, this),
					value:channel.color.a * 100
				});
			
			slider.find('a')
				.css('border-width', '2px')
				.css('border-color', channel.color.toRGBString());
			
			div.append(slider);
			
			this.element.append(div);
			return slider;
		},
		
		_ignoreChanges: false,
		
		_sliderChanged: function(event, ui){
			if (!this._ignoreChanges){
				for(var i = 0; i < this.options.channels.length; i++){
					this.options.channels[i].color.a = this.sliders[i].slider('value')/100;
				}
				if (this.options.change)
					this.options.change(this.options.channels);
			}
		},
		
		getValues: function(){
			return this.options.channels;
		},
		
		channels: function(val){
			this._ignoreChanges = true;
			for (var i = 0; i < val.length; i++){
				this.sliders[i].slider({value:val[i].color.a* 100});
			}
			this.options.channels = val;
			this._ignoreChanges = false;
		},
		
		// Use the _setOption method to respond to changes to options
		_setOption: function( key, value ) {
		  switch( key ) {
			case "clear":
			  // handle changes to clear option
			  break;
		  }
	 
		  // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
		  $.Widget.prototype._setOption.apply( this, arguments );
		  // In jQuery UI 1.9 and above, you use the _super method instead
		  this._super( "_setOption", key, value );
		},
	 
		// Use the destroy method to clean up any modifications your widget has made to the DOM
		destroy: function() {
		  // In jQuery UI 1.8, you must invoke the destroy method from the base widget
		  $.Widget.prototype.destroy.call( this );
		  // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
		}
	});
}(jQuery));