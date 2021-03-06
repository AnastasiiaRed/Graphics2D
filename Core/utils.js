// Macroses
function isNumber(v){ return v.constructor === Number; }
function isString(v){ return v.constructor === String; }
function isBoolean(v){ return v.constructor === Boolean; }
function isObject(v){ return v.constructor === Object; }
function isArray(v){ return Array.isArray(v); }
// /Macroses

Delta.xtypes = {
	rect : Delta.Rect,
	circle : Delta.Circle,
	path : Delta.Path,
	curve : Delta.Curve,
	image : Delta.Image,
	text : Delta.Text,

	gradient : Delta.Gradient,
	pattern : Delta.Pattern
};

// Bounds class
function Bounds(x, y, w, h){
	if(w < 0){
		w = -w;
		x -= w;
	}
	if(h < 0){
		h = -h;
		y -= h;
	}

	this.x = this.x1 = x;
	this.y = this.y1 = y;
	this.w = this.width  = w;
	this.h = this.height = h;
	// todo: remove this all
	// and make a method `get` or `corner`: aabb.corner('left');
	this.x2 = x + w;
	this.y2 = y + h;
	this.cx = x + w / 2;
	this.cy = y + h / 2;
}

Delta.bounds = function(x, y, width, height){
	return new Bounds(x, y, width, height);
};

Delta.isPointInRect = function(px, py, x, y, w, h){
	if(w < 0){
		w = -w;
		x -= w;
	}
	if(h < 0){
		h = -h;
		y -= h;
	}
	return px > x && py > y && px < x + w && py < y + h;
}

// Thenable is like Promise but faster 4x at Firefox and >100x at Chrome
function Thenable(func){
	func(this.resolve.bind(this), this.reject.bind(this));
}

Thenable.prototype = {
	resolve: function(value){
		if(this.success){
			this.success(value);
		}
	},

	reject: function(value){
		if(this.error){
			this.error(value);
		}
	},

	then: function(success, error){
		this.success = success;
		this.error = error;
	}
};

// utils
/* function argument(index){
	return function(value){
		return this.argument( index, value );
	};
} */// не нужно

// wrapper for quick calls
function wrap(args, index){
	var funcName = args[index];
	args = slice.call(args, index + 1);
	return function(){
		this[funcName].apply(this, args);
	};
}

// typeofs

/*
use common typeofs
String: something + '' === something
Boolean: !!something === something
Array: Array.isArray(something)
Number: +something === something
Function: typeof something === 'function'
 */

/*
Guidelines:
Types: Array, String, Boolean, Number, UnitNumber
 */

function isObject(a){
	return toString.call(a) === '[object Object]';
}

function isPivot(v){
	return Array.isArray(v) || v in Delta.corners;
}

function isNumberLike(value){
	return +value === value || (value + '' === value && reNumberLike.test(value));
}

// todo: Pattern.isPatternLike();
function isPatternLike(value){
	return value instanceof Image ||
			(isObject(value) && has(value, 'image')) ||
			(value + '' === value && !(
				value.indexOf('http://') &&
				value.indexOf('https://') &&
				value.indexOf('./') &&
				value.indexOf('../') &&
				value.indexOf('data:image/') &&
				value.indexOf('<svg')
			) );
}

function parsePoint(point){
	if(+point === point){
		point = Delta.distance(point);
		return [point, point];
	}
	return [
		Delta.distance(point[0]),
		Delta.distance(point[1])
	];
}

Delta.Class = Class;
Delta.Bounds = Bounds;
// Delta.argument = argument;
Delta.wrap = wrap;
Delta.isObject = isObject;
Delta.isNumberLike = isNumberLike;
Delta.isPatternLike = isPatternLike;

// constants
Delta.dashes = {
	shortdash:			[4, 1],
	shortdot:			[1, 1],
	shortdashdot:		[4, 1, 1, 1],
	shortdashdotdot:	[4, 1, 1, 1, 1, 1],
	dot:				[1, 3],
	dash:				[4, 3],
	longdash:			[8, 3],
	dashdot:			[4, 3, 1, 3],
	longdashdot:		[8, 3, 1, 3],
	longdashdotdot:		[8, 3, 1, 3, 1, 3]
};

Delta.fileTypes = {
	'jpeg': 'image/jpeg',
	'jpg': 'image/jpeg',
	'png': 'image/png',
	'webp': 'image/webp'
};

Delta.corners = {
	'left'  : [0, 0.5],
	'right' : [1, 0.5],
	'top'   : [0.5, 0],
	'bottom': [0.5, 1],
	'center': [0.5, 0.5],
	'left top'    : [0, 0],
	'top left'    : [0, 0],
	'left bottom' : [0, 1],
	'bottom left' : [0, 1],
	'right top'   : [1, 0],
	'top right'   : [1, 0],
	'right bottom': [1, 1],
	'bottom right': [1, 1],

	'lt'	: [0, 0],
	'tl'	: [0, 0],
	'lb'	: [0, 1],
	'bl'	: [0, 1],
	'rt'	: [1, 0],
	'tr'	: [1, 0],
	'rb'	: [1, 1],
	'br'	: [1, 1]
};

Delta.colors = { // http://www.w3.org/TR/css3-color/#svg-color
	'aliceblue':				'f0f8ff',
	'antiquewhite':				'faebd7',
	'aqua':						'0ff',
	'aquamarine':				'7fffd4',
	'azure':					'f0ffff',
	'beige':					'f5f5dc',
	'bisque':					'ffe4c4',
	'black':					'000',
	'blanchedalmond':			'ffebcd',
	'blue':						'00f',
	'blueviolet':				'8a2be2',
	'brown':					'a52a2a',
	'burlywood':				'deb887',
	'burntsienna':				'ea7e5d',
	'cadetblue':				'5f9ea0',
	'chartreuse':				'7fff00',
	'chocolate':				'd2691e',
	'chucknorris':				'c00000',
	'coral':					'ff7f50',
	'cornflowerblue':			'6495ed',
	'cornsilk':					'fff8dc',
	'crimson':					'dc143c',
	'cyan':						'0ff',
	'darkblue':					'00008b',
	'darkcyan':					'008b8b',
	'darkgoldenrod':			'b8860b',
	'darkgray':					'a9a9a9',
	'darkgreen':				'006400',
	'darkgrey':					'a9a9a9',
	'darkkhaki':				'bdb76b',
	'darkmagenta':				'8b008b',
	'darkolivegreen':			'556b2f',
	'darkorange':				'ff8c00',
	'darkorchid':				'9932cc',
	'darkred':					'8b0000',
	'darksalmon':				'e9967a',
	'darkseagreen':				'8fbc8f',
	'darkslateblue':			'483d8b',
	'darkslategray':			'2f4f4f',
	'darkslategrey':			'2f4f4f',
	'darkturquoise':			'00ced1',
	'darkviolet':				'9400d3',
	'deeppink':					'ff1493',
	'deepskyblue':				'00bfff',
	'dimgray':					'696969',
	'dimgrey':					'696969',
	'dodgerblue':				'1e90ff',
	'firebrick':				'b22222',
	'floralwhite':				'fffaf0',
	'forestgreen':				'228b22',
	'fuchsia':					'f0f',
	'gainsboro':				'dcdcdc',
	'ghostwhite':				'f8f8ff',
	'gold':						'ffd700',
	'goldenrod':				'daa520',
	'gray':						'808080',
	'green':					'008000',
	'greenyellow':				'adff2f',
	'grey':						'808080',
	'honeydew':					'f0fff0',
	'hotpink':					'ff69b4',
	'indianred':				'cd5c5c',
	'indigo':					'4b0082',
	'ivory':					'fffff0',
	'khaki':					'f0e68c',
	'lavender':					'e6e6fa',
	'lavenderblush':			'fff0f5',
	'lawngreen':				'7cfc00',
	'lemonchiffon':				'fffacd',
	'lightblue':				'add8e6',
	'lightcoral':				'f08080',
	'lightcyan':				'e0ffff',
	'lightgoldenrodyellow':		'fafad2',
	'lightgray':				'd3d3d3',
	'lightgreen':				'90ee90',
	'lightgrey':				'd3d3d3',
	'lightpink':				'ffb6c1',
	'lightsalmon':				'ffa07a',
	'lightseagreen':			'20b2aa',
	'lightskyblue':				'87cefa',
	'lightslategray':			'789',
	'lightslategrey':			'789',
	'lightsteelblue':			'b0c4de',
	'lightyellow':				'ffffe0',
	'lime':						'0f0',
	'limegreen':				'32cd32',
	'linen':					'faf0e6',
	'magenta':					'f0f',
	'maroon':					'800000',
	'mediumaquamarine':			'66cdaa',
	'mediumblue':				'0000cd',
	'mediumorchid':				'ba55d3',
	'mediumpurple':				'9370db',
	'mediumseagreen':			'3cb371',
	'mediumslateblue':			'7b68ee',
	'mediumspringgreen':		'00fa9a',
	'mediumturquoise':			'48d1cc',
	'mediumvioletred':			'c71585',
	'midnightblue':				'191970',
	'mintcream':				'f5fffa',
	'mistyrose':				'ffe4e1',
	'moccasin':					'ffe4b5',
	'navajowhite':				'ffdead', // FF is not dead
	'navy':						'000080',
	'oldlace':					'fdf5e6',
	'olive':					'808000',
	'olivedrab':				'6b8e23',
	'orange':					'ffa500',
	'orangered':				'ff4500',
	'orchid':					'da70d6',
	'palegoldenrod':			'eee8aa',
	'palegreen':				'98fb98',
	'paleturquoise':			'afeeee',
	'palevioletred':			'db7093',
	'papayawhip':				'ffefd5',
	'peachpuff':				'ffdab9',
	'peru':						'cd853f',
	'pink':						'ffc0cb',
	'plum':						'dda0dd',
	'powderblue':				'b0e0e6',
	'purple':					'800080',
	'red':						'f00',
	'rosybrown':				'bc8f8f',
	'royalblue':				'4169e1',
	'saddlebrown':				'8b4513',
	'salmon':					'fa8072',
	'sandybrown':				'f4a460',
	'seagreen':					'2e8b57',
	'seashell':					'fff5ee',
	'sienna':					'a0522d',
	'silver':					'c0c0c0',
	'skyblue':					'87ceeb',
	'slateblue':				'6a5acd',
	'slategray':				'708090',
	'slategrey':				'708090',
	'snow':						'fffafa',
	'springgreen':				'00ff7f',
	'steelblue':				'4682b4',
	'tan':						'd2b48c',
	'teal':						'008080',
	'thistle':					'd8bfd8',
	'tomato':					'ff6347',
	'turquoise':				'40e0d0',
	'violet':					'ee82ee',
	'wheat':					'f5deb3',
	'white':					'fff',
	'whitesmoke':				'f5f5f5',
	'yellow':					'ff0',
	'yellowgreen':				'9acd32'
};

// DOM
Delta.coordsOfElement = function(element){ // returns coords of a DOM element
	var box = element.getBoundingClientRect(),
		style = window.getComputedStyle(element);

	return {
		x: box.left + parseInt(style.borderLeftWidth || 0) + parseInt(style.paddingLeft || 0),
		y: box.top  + parseInt(style.borderTopWidth  || 0) + parseInt(style.paddingTop  || 0)
	};
};

// Clean functions
Delta.clone = function(object){
	var result = new object.constructor();
	// todo: replace to Object.keys
	for(var i in object){
		if(has(object, i)){
			if(typeof object[i] === 'object' && !(object[i] instanceof Context) && !(object[i] instanceof Image)){
				result[i] = Delta.clone(object[i]);
			} else {
				result[i] = object[i];
			}
		}
	}
	return result;
};

Delta.strParse = {
	functions : function(str){
		var result = [];
		str = str.split(')');
		str.forEach(function(part){
			part = part.trim();
			if(part === ''){
				return;
			}

			result.push({
				args: part.split('(')[1].split(',').map(function(arg){
					return arg.trim();
				}),
				method: part.match(/[a-z]+/)[0]
			});
		});
		return result;
	},

	// partition('a b c-d', [' ', '-']) -> ['a', ' ', 'b', ' ', 'c',  '-', 'd']
	partition : function(str, separators){
		var result = [],
			curline = '';
		for(var i = 0; i < str.length; i++){
			if(separators.indexOf(str[i]) === -1){
				curline += str[i];
			} else {
				if(curline !== ''){
					result.push(curline);
					curline = '';
				}
				result.push(str[i]);
			}
		}
		if(curline !== ''){
			result.push(curline);
		}
		return result;
	}
};

// Matrices
Delta.parseTransform = function(attrs, element){
	// todo: check about speed and think how to raise it
	if(Array.isArray(attrs.transform)){
		return attrs.transform;
	}

	var result = [1, 0, 0, 1, 0, 0];
	if(attrs.transform === 'attributes'){
		(attrs.transformOrder || 'translate rotate scale skew').split(' ').forEach(function(method){
			if(attrs[method] !== undefined){
				result = Delta.transforms[method](result, attrs[method], element);
			}
		});
	} else {
		var str = attrs.transform.split(')');
		str.forEach(function(part){
			part = part.trim();
			if(part === ''){
				return;
			}

			var method = part.match(/[a-z]+/);
			var args = part.split('(')[1].split(',').map(function(arg){
				return arg.trim();
			});
			result = Delta.transforms[method](result, args, element);
		});
	}
	return result;
};

Delta.transforms = {
	translate: function(matrix, args){
		matrix[4] += +args[0];
		matrix[5] += +args[1];
		return matrix;
	},

	// todo: optimize matrix multiplications
	// todo: corner(..., {transform: 'ignore'})

	/* if(pivot){
		pivot = this.corner(pivot, {transform: 'ignore'});
		e = pivot[0] + e - a * pivot[0] - c * pivot[1];
		f = pivot[1] + f - b * pivot[0] - d * pivot[1];
	} */

	scale: function(matrix, args, elem){
		if(+args === args){
			// args = scale
			args = [args, args];
		} else if(+args[1] !== args[1]){
			// args = [scale, pivot]
			args = [args[0], args[0], args[1]];
		}

		var pivot = elem.corner(args[2] || 'center');
		matrix = Delta.transform(matrix, [1, 0, 0, 1, pivot[0], pivot[1]]);
		matrix = Delta.transform(matrix, [args[0], 0, 0, args[1], 0, 0]);
		matrix = Delta.transform(matrix, [1, 0, 0, 1, -pivot[0], -pivot[1]]);

		return matrix;
	},

	skew: function(matrix, args, elem){
		if(+args === args){
			// args = skew
			args = [args, args];
		} else if(+args[1] !== args[1]){
			// args = [skew, pivot]
			args = [args[0], args[0], args[1]];
		}
		args[0] = (+args[0]) / 180 * Math.PI;
		args[1] = (+args[1]) / 180 * Math.PI;

		var pivot = elem.corner(args[2] || 'center');
		matrix = Delta.transform(matrix, [1, 0, 0, 1, pivot[0], pivot[1]]);
		matrix = Delta.transform(matrix, [1, Math.tan(args[1]), Math.tan(args[0]), 1, 0, 0]);
		matrix = Delta.transform(matrix, [1, 0, 0, 1, -pivot[0], -pivot[1]]);

		return matrix;
	},

	rotate: function(matrix, args, elem){
		if(+args === args){
			args = [args];
		}
		args[0] = (+args[0]) / 180 * Math.PI;

		var pivot = elem.corner(args[1] || 'center');
		matrix = Delta.transform(matrix, [1, 0, 0, 1, pivot[0], pivot[1]]);
		matrix = Delta.transform(matrix, [Math.cos(args[0]), Math.sin(args[0]), -Math.sin(args[0]), Math.cos(args[0]), 0, 0]);
		matrix = Delta.transform(matrix, [1, 0, 0, 1, -pivot[0], -pivot[1]]);

		return matrix;
	}
};

Delta.isIdentityTransform = function(matrix){
	return matrix[5] === 0 && matrix[4] === 0 &&
			matrix[3] === 1 && matrix[2] === 0 &&
			matrix[1] === 0 && matrix[0] === 1;
};

Delta.transform = function(m1, m2){ // multiplies two 2D-transform matrices
	return [
		m1[0] * m2[0] + m1[2] * m2[1],
		m1[1] * m2[0] + m1[3] * m2[1],
		m1[0] * m2[2] + m1[2] * m2[3],
		m1[1] * m2[2] + m1[3] * m2[3],
		m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
		m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
	];
};

Delta.transformPoint = function(matrix, point){
	return [
		matrix[0] * point[0] + matrix[2] * point[1] + matrix[4],
		matrix[1] * point[0] + matrix[3] * point[1] + matrix[5]
	];
};

Delta.inverseTransform = function(matrix){
	var det = matrix[0] * matrix[3] - matrix[2] * matrix[1];

	if(det === 0){
		return null;
	}

	return [
		matrix[3] / det,
		-matrix[1] / det,
		-matrix[2] / det,
		matrix[0] / det,
		-(matrix[3] * matrix[4] - matrix[2] * matrix[5]) / det,
		(matrix[1] * matrix[4] - matrix[0] * matrix[5]) / det
	];
};

Delta.color = function color(value){ // parses CSS-like colors (rgba(255,0,0,0.5), green, #f00...)
	if(value === undefined){
		return;
	}
	if(Array.isArray(value)){
		return value.slice(0, 4);
	}
	if(value + '' !== value){
		throw 'Not a color: ' + value.toString();
	}

	// rgba(255, 100, 20, 0.5)
	if(value.indexOf('rgb') === 0){
		value = value.substring(value.indexOf('(') + 1, value.length-1).replace(/\s/g, '').split(',');
		var opacity = value[3];
		value = value.slice(0, 3).map(function(v, i){
			// rgba(100%, 0%, 50%, 1)
			if(v.indexOf('%') > 0){
				return Math.round(parseInt(v) * 2.55);
			}
			return parseInt(v);
		});

		if(opacity === undefined){
			opacity = 1;
		}
		value.push(Number(opacity));

		return value;
	}
	// #bebebe
	else if(value[0] === '#'){
		// remove the # and turn into array
		value = value.substring(1);

		// #555
		if(value.length === 3){
			// 'f0a' -> 'ff00aa'
			value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
		}

		return [parseInt(value.substring(0, 2), 16), parseInt(value.substring(2, 4), 16), parseInt(value.substring(4, 6), 16), 1];
	}
	// 'red'
	else if(value in Delta.colors){
		return Delta.color('#' + Delta.colors[value]);
	}
	// 'rand'
	else if(value === 'rand'){
		return [Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), 1];
	}

	return [0, 0, 0, 0];
};

Delta.angleUnit = 'grad';
Delta.unit = 'px';

var units = 'pt em in cm mm pc ex ch rem v wvh vmin vmax'.split(' ');
var defaultUnits = {
	// my values; may be different on different screens / browsers / devices / etc
	px: 1, ch: 8, cm: 37.78125, em: 16,
	ex: 7.15625, 'in': 96, mm: 3.765625,
	pc: 16, pt: 1.328125, rem: 16, v: 16,
	vmax: 13.65625, vmin: 4.78125, wvh: 16
	// values from p5.js:
	// pt: 1.25
	// pc: 15
	// mm: 3.543307
	// cm: 35.43307
	// in: 90
};

Delta.snapToPixels = 1;
Delta.lastDistanceObject = null;

function distance(value, dontsnap){
	if(value === undefined) return;
	if(!value) return 0;
	// todo: snapToPixels === 1 ? return Math.round(...) : ...
	if(Delta.snapToPixels && !dontsnap){
		return Math.round(Delta.distance(value, true) / Delta.snapToPixels) * Delta.snapToPixels;
	}

	if(value.constructor === Number){
		if(Delta.unit !== 'px'){
			return Delta.distance(value + '' + Delta.unit);
		}

		return value;
	}

	value += '';
	if(value.indexOf('px') === value.length-2){
		return parseInt(value);
	}

	if(value.constructor !== String){
		Delta.lastDistanceObject = value;
		return value;
	}

	var unit = value.replace(/[\d\.]+?/g, '');
	value = value.replace(/[^\d\.]+?/g, '');
	if(unit === ''){
		return value;
	}

	if(!Delta.units){
		if(!document){
			Delta.units = defaultUnits;
		} else {
			var div = document.createElement('div');
			document.body.appendChild(div); // FF doesn't need this :)
			Delta.units = {};
			units.forEach(function(unit){
				div.style.width = '1' + unit;
				Delta.units[unit] = parseFloat(getComputedStyle(div).width);
			});
			document.body.removeChild(div);
		}
	}

	if(Delta.snapToPixels === 1){
		return Math.round(Delta.units[unit] * value);
	}
	return Delta.units[unit] * value;
}

Delta.distance = distance;