// cache api

// /cache api
Gradient = new Class({
	initialize: function(type, colors, from, to, context){
		this.context = context;

		if(type + '' !== type){
			to = from;
			from = colors;
			colors = type;
			type = 'linear';
		}

		this.type = type || 'linear';
		this.attrs = {
			from: from,
			to: to,
			colors: Gradient.parseColors(colors)
		};
/*
<<<<<<< Updated upstream
		if(Gradient.types[this.type]){
			Object.assign(this.attrHooks, Gradient.types[this.type].attrHooks);
			if(Gradient.types[this.type].initialize){
				Gradient.types[this.type].initialize.call(this);
=======
<<<<<<< Updated upstream
		for(var i = 0, l = keys.length; i < l; i++){
			if(keys[i] == t){
				return _.color(stops[keys[i]]);
			}
			else if(parseFloat(last) < t && parseFloat(keys[i]) > t){
				var c1 = _.color(stops[last]),
					c2 = _.color(stops[keys[i]]);
				t = (t - parseFloat(last)) / (parseFloat(keys[i]) - parseFloat(last));
				return [
					c1[0] + (c2[0] - c1[0]) * t | 0, // todo: Math.round
					c1[1] + (c2[1] - c1[1]) * t | 0,
					c1[2] + (c2[2] - c1[2]) * t | 0,
					c1[3] + (c2[3] - c1[3]) * t
				];
=======
		if(Gradient.types[this.type]){
			// мы расширяем общий! attrHooks!
			// Object.assign(this.attrHooks, Gradient.types[this.type].attrHooks);
			if(Gradient.types[this.type].initialize){
				Gradient.types[this.type].initialize.call(this);
>>>>>>> Stashed changes
>>>>>>> Stashed changes
			}
		} */
	},

	useCache: true,

	attr: Drawable.prototype.attr,

	attrHooks: {
		colors: {
			set: function(value){
				this.update();
				return Gradient.parseColors(value);
			}
		}
	},

	color: function(t, value){
		if(value !== undefined){
			this.attrs.colors[t] = value;
			return this.update();
		}
		if(this.attrs.colors[t]){
			return $.color(this.attrs.colors[t]);
		}

		var colors = this.attrs.colors,
			keys = Object.keys(colors).sort();

		if(t < keys[0]){
			return $.color(colors[keys[0]]);
		} else if(t > keys[keys.length - 1]){
			return $.color(colors[keys[keys.length - 1]]);
		}

		for(var i = 0; i < keys.length; i++){
			if(+keys[i] > t){
				var c1 = $.color(colors[keys[i - 1]]),
					c2 = $.color(colors[keys[i]]);
				t = (t - +keys[i - 1]) / (+keys[i] - +keys[i - 1]);
				return [
					c1[0] + (c2[0] - c1[0]) * t + 0.5 | 0,
					c1[1] + (c2[1] - c1[1]) * t + 0.5 | 0,
					c1[2] + (c2[2] - c1[2]) * t + 0.5 | 0,
					+(c1[3] + (c2[3] - c1[3]) * t).toFixed(2)
				];
			}
		}
	},

	/* key : function(from, to){
		return [this._type, from, to, JSON.stringify(this._colors)].join(',');
	}, */

	update: function(){
		this.context.update();
		return this;
	},

	toCanvasStyle: function(ctx, element){
		return Gradient.types[this.type].toCanvasStyle.call(this, ctx, element);
	}
});

Gradient.parseColors = function(colors){
	if(!Array.isArray(colors)){
		return colors;
	}

	var stops = {},
		step = 1 / (colors.length - 1);
	colors.forEach(function(color, i){
		stops[step * i] = color;
	});
	return stops;
};

// Linear and radial gradient species
Gradient.types = {
	linear: {
		attrHooks: {
			from: {
				set: function(value){
					this.update();
					return value;
				}
			},
			to: {
				set: function(value){
					this.update();
					return value;
				}
			}
		},
		toCanvasStyle: function(ctx, element){
			var from = element.corner(this.attrs.from),
				to = element.corner(this.attrs.to),
				colors = this.attrs.colors;

			/* var key = this.key(from, to);
			if(this.useCache && this.context.fillCache[key]){
				return this.context.fillCache[key];
			} */

			var grad = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);
			Object.keys(colors).forEach(function(offset){
				grad.addColorStop(offset, colors[offset]);
			});
			return grad;
		}
	},

	radial: {
		initialize: function(){
			// from-to -> radius, center, etc
			if(this.attrs.from && Array.isArray(this.attrs.from)){
				this.attrs.startRadius = this.attrs.from[2] || 0;
				this.attrs.from = this.attrs.from.slice(0, 2);
			} else {
				if(!this.attrs.from){
					this.attrs.from = 'center';
				}
				this.attrs.startRadius = 0;
			}

			if(this.attrs.to && Array.isArray(this.attrs.to)){
				this.attrs.radius = this.attrs.to[2] || 'auto';
				this.attrs.to = this.attrs.to.slice(0, 2);
			} else {
				if(!this.attrs.to){
					this.attrs.to = this.attrs.from;
				}
				this.attrs.radius = 'auto';
			}
		},

		attrHooks: {
			from: {
				set: function(value){
					if(Array.isArray(value) && value.length > 2){
						this.attrs.startRadius = value[2];
						value = value.slice(0, 2);
					}
					this.update();
					return value;
				}
			},
			to: {
				set: function(value){
					if(Array.isArray(value) && value.length > 2){
						this.attrs.radius = value[2];
						value = value.slice(0, 2);
					}
					this.update();
					return value;
				}
			},

			radius: {
				set: function(value){
					this.update();
					return value;
				}
			},

			startRadius: {
				set: function(value){
					this.update();
					return value;
				}
			}
		},

		toCanvasStyle: function(ctx, element){
			var from = element.corner(this.attrs.from),
				to = element.corner(this.attrs.to),
				radius = this.attrs.radius === 'auto' ? element.bounds().height : this.attrs.radius,
				colors = this.attrs.colors;

			var grad = ctx.createRadialGradient(
				from[0],
				from[1],
				this.attrs.startRadius,
				to[0],
				to[1],
				radius
			);

			Object.keys(colors).forEach(function(offset){
				grad.addColorStop(offset, colors[offset]);
			});
			return grad;
		}
	}
};