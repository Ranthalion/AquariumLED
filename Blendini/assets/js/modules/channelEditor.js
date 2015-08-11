(function($){
	$.widget('led.channelEditor',{
		// These options will be used as defaults
		options: { 
		  clear: null,
		  change: null,
		  channels: null
		},
		
		sliders: null,
		swatch: null,
		wrapper: null,
		
		// Set up the widget
		_create: function() {
			var self = this;
			this.sliders = new Array();
			var wrapper = $('<div>').css('float','left');
			
			for (var i = 0; i < this.options.channels.length; i++){
				var d = this.createChannelBar(this.options.channels[i]);
				
				this.sliders[i] = this.createSlider(this.options.channels[i]);
				d.append(this.sliders[i])
				wrapper.append(d);
			}
			this.element.append(wrapper);
			this.wrapper = wrapper;
			this.resizeLabels();
			this.createSwatch(wrapper);
			this.resizeSliders();
			this.element.after($('<div>').css('clear','both'));
			this._sliderChanged();
		},
		resize: function(){
			this.resizeLabels();
			this.resizeSwatch();
			this.resizeSliders();
		},
		resizeSliders: function(){
			var spanWidth = this.element.find('span:first').outerWidth();
			var swatchWidth = this.swatch.outerWidth();
			console.log('spanWidth: ' + spanWidth);
			console.log('swatchWidth: ' + swatchWidth);
			this.element.find('.ui-slider').width(this.element.width() - spanWidth -swatchWidth-50);
		},
		resizeLabels: function(){
			this.element.find('span').width('auto')
			var size = 0;
			this.element.find('span').each(function(){
				if ($(this).width() > size)
					size = $(this).width()
			});
			this.element.find('span').width(size);
		},
		createSwatch: function(el){
			var size = 0;
			el.find('div').each(function(){
				if ($(this).outerHeight() > size)
					size = $(this).outerHeight();
			});
			size = size * this.options.channels.length;
			this.swatch = $('<div>')
				.css('width', size)
				.css('height', size)
				.css('float', 'right')
				.css('margin-right', '16px')
				//.css('padding-right', '8px')
				.css('background', 'black')
				.css('border-style', 'solid')
				.css('border-width','2px')
				.css('border-color','black')
				.css('border-radius', '4px');
			
			this.element.append(this.swatch);
		},
		resizeSwatch: function(){
			var size = 0;
			this.wrapper.find('div').each(function(){
				if ($(this).outerHeight() > size)
					size = $(this).outerHeight();
			});
			size = size * this.options.channels.length;
			this.swatch.css('width', size)
				.css('height', size);
		},
		createChannelBar: function(channel) {
			var div = $('<div>')
				.css('clear','both')
				.css('padding','5px 0px 5px 0px');
			div.append($('<span>')
				.text(channel.name)
				.css('display', 'inline-block')
				.css('margin-right','15px'));
			return div;
		},
		
		createSlider: function(channel){
			var slider = $('<div>')
				.css('display', 'inline-block')
				.css('width', '200px')
				.css('background', 'rgb(' + channel.color.r + ',' + channel.color.g + ',' + channel.color.b + ')')
				.slider({max:100, 
					slide: $.proxy(this._sliderChanged, this),
					change: $.proxy(this._sliderChanged, this),
					value:channel.color.a * 100
				});
			
			slider.find('a')
				.css('border-width', '2px')
				.css('border-color', channel.color.toRGBString());
			return slider;
		},
		_ignoreChanges: false,
		
		_sliderChanged: function(event, ui){
			if (!this._ignoreChanges){
				var colors = new Array();
				for(var i = 0; i < this.options.channels.length; i++){
					this.options.channels[i].color.a = this.sliders[i].slider('value')/100;
					colors.push(this.options.channels[i].color);
				}
				
				var rgb = Color.Mix(colors).toRGBString();
				this.swatch.css('background', rgb);
				
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
			this._sliderChanged();
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