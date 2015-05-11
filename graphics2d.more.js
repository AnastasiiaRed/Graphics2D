/*  Graphics2D More 1.9.0
 * 
 *  Author: Dmitriy Miroshnichenko aka Keyten <ikeyten@gmail.com>
 *  Last edit: 11.5.2015
 *  License: MIT / LGPL
 */

(function(window, $, undefined){

	var Context = $.Context,
		Shape = $.Shape,
		Rect = $.Rect,
		Circle = $.Circle,
		Curve = $.Curve,
		Path = $.Path,
		Img = $.Image,
		Text = $.Text,
		TextBlock = $.TextBlock,
		Gradient = $.Gradient,
		Pattern = $.Pattern,
		Class = $.Class,
		isHash = $.isObject,
		isObject = $.isObject,
		isString = $.isString,
		extend = $.extend,
		Bounds = $.Bounds;

	var Ellipse, Polygon, Star,

	pi2 = Math.PI * 2,
	emptyFunc = function(){};

//# Shapes

Ellipse = new Class(Shape, {

	init : function(){
		var props = this._cx;
		if(isHash( props )){
			this._cx = props.cx || props.x || 0;
			this._cy = props.cy || props.y || 0;
			if(props.radius !== undefined){
				this._rx = this._ry = props.radius;
			} else {
				this._rx = props.rx;
				this._ry = props.ry;
			}
			if(props.kappa !== undefined)
				this._kappa = props.kappa;

			this._parseHash(props);
		} else {
			this._processStyle();
		}
	},

	_kappa : 4/3 * (Math.sqrt(2) - 1),

	// parameters
	cx : function(cx){
		return this._property('cx', cx);
	},
	cy : function(cy){
		return this._property('cy', cy);
	},
	rx : function(rx){
		return this._property('rx', rx);
	},
	ry : function(ry){
		return this._property('ry', ry);
	},
	kappa : function(kappa){
		return this._property('kappa', kappa);
	},

	bounds : function(){
		return new Bounds(this._cx - this._rx, this._cy - this._ry, this._rx * 2, this._ry * 2);
	},
	processPath : function(ctx){
		// http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas/23184724#23184724
		ctx.beginPath();
		if(ctx.ellipse && this._kappa === Ellipse.kappa){
			// x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise
			ctx.ellipse(this._cx, this._cy, this._rx, this._ry, 0, 0, Math.PI * 2, true);
			return;
		}

		var kappa = this._kappa,
			cx = this._cx,
			cy = this._cy,
			rx = this._rx,
			ry = this._ry,

			ox = rx * kappa,
			oy = ry * kappa;

		ctx.moveTo(cx - rx, cy);
		ctx.bezierCurveTo(cx - rx, cy - oy, cx - ox, cy - ry, cx, cy - ry);
		ctx.bezierCurveTo(cx + ox, cy - ry, cx + rx, cy - oy, cx + rx, cy);
		ctx.bezierCurveTo(cx + rx, cy + oy, cx + ox, cy + ry, cx, cy + ry);
		ctx.bezierCurveTo(cx - ox, cy + ry, cx - rx, cy + oy, cx - rx, cy);
		ctx.closePath(); // fix for a last corner with kappa=0
	}

});

Ellipse.props = [ 'cx', 'cy', 'rx', 'ry', 'fill', 'stroke' ];
Ellipse.kappa = Ellipse.prototype._kappa;

Context.prototype.ellipse = function(){
	return this.push( new Ellipse(arguments, this) );
};

$.fx.step.kappa = $.fx.step.float;
Polygon = new Class(Shape, {

	init : function(){
		var props = this._cx;
		if(isHash( props )){
			this._cx = props.cx || props.x || 0;
			this._cy = props.cy || props.y || 0;
			this._radius = props.radius;
			this._sides = props.sides;
			this._parseHash(props);
		} else {
			this._processStyle();
		}
	},

	// parameters
	cx : function(value){
		return this._property('cx', value);
	},

	cy : function(value){
		return this._property('cy', value);
	},

	radius : function(value){
		return this._property('radius', value);
	},

	sides : function(value){
		return this._property('sides', value);
	},

	bounds : function(){
		return new Bounds(this._cx - this._radius, this._cy - this._radius, this._radius * 2, this._radius * 2);
	},

	processPath : function(ctx){
		var angle,
			sides = pi2 / this._sides,
			i = 0;

		ctx.beginPath();

		for(; i < this._sides; i++){
			// angle = pi2 / sides * i
			angle = sides * i;
			ctx.lineTo(this._cx + this._radius * Math.cos(angle), this._cy + this._radius * Math.sin(angle));
		}
			
		ctx.closePath();
	}

});
Polygon.props = [ 'cx', 'cy', 'radius', 'sides', 'fill', 'stroke' ];

Context.prototype.polygon = function(){
	return this.push( new Polygon(arguments, this) );
};

$.fx.step.sides = $.fx.step.int;
Star = new Class(Shape, {

	init : function(){
		var props = this._cx;
		if(isHash( props )){
			this._cx = props.cx || props.x || 0;
			this._cy = props.cy || props.y || 0;
			this._radius1 = props.radius1 || (props.radius ? props.radius[0] : 0);
			this._radius2 = props.radius2 || (props.radius ? props.radius[1] : 0);
			this._points = props.points;
			this._distortion = props.distortion || 0;
			this._parseHash(props);
		} else {
			this._processStyle();
		}
	},

	_distortion : 0,

	// parameters
	cx : function(value){
		return this._property('cx', value);
	},

	cy : function(value){
		return this._property('cy', value);
	},

	radius1 : function(value){
		return this._property('radius1', value);
	},

	radius2 : function(value){
		return this._property('radius2', value);
	},

	points : function(value){
		return this._property('points', value);
	},

	distortion : function(value){
		return this._property('distortion', value);
	},

	bounds : function(){
		var r = Math.max(this._radius1, this._radius2);
		return new Bounds(this._cx - r, this._cy - r, r * 2, r * 2);
	},
	processPath : function(ctx){
		var angle1, angle2,
			offset = Math.PI / this._points,
			i = 0;

		ctx.beginPath();

		for(; i < this._points; i++){
			angle1 = pi2 * i / this._points;
			angle2 = angle1 + offset + this._distortion;
			ctx.lineTo(this._cx + this._radius1 * Math.cos(angle1), this._cy + this._radius1 * Math.sin(angle1));
			ctx.lineTo(this._cx + this._radius2 * Math.cos(angle2), this._cy + this._radius2 * Math.sin(angle2));
		}

		ctx.closePath();
	}

});
Star.props = [ 'cx', 'cy', 'radius1', 'radius2', 'points', 'fill', 'stroke' ];

Context.prototype.star = function(){
	return this.push( new Star(arguments, this) );
};

$.fx.step.radius1 = $.fx.step.int;
$.fx.step.radius2 = $.fx.step.int;
$.fx.step.points = $.fx.step.int;
$.fx.step.distortion = $.fx.step.float;
//# RoundRect
Rect.prototype._rx = 0;
Rect.prototype._ry = 0;
Rect.prototype.initialize = function(){
	var props = this._x;
	if(isHash( props )){
		this._rx = props.rx || props.radius || 0;
		this._ry = props.ry || props.radius || 0;
	}
};
Rect.prototype.processPath = function(ctx){
	var x = this._x,
		y = this._y,
		w = this._width,
		h = this._height,
		rx = this._rx,
		ry = this._ry;

	ctx.beginPath();
	if(rx === 0 && ry === 0){
		ctx.rect(this._x, this._y, this._width, this._height);
	}
	else {
		ctx.moveTo(x, y + ry);

		// left side
		ctx.lineTo(x, y+h-ry);
		// left bottom corner
		ctx.quadraticCurveTo(x, y+h, x+rx, y+h);

		// bottom side
		ctx.lineTo(x+w-rx, y+h);
		// right bottom corner
		ctx.quadraticCurveTo(x+w, y+h, x+w, y+h-ry);

		// right side
		ctx.lineTo(x+w, y+ry);
		// right top corner
		ctx.quadraticCurveTo(x+w, y, x+w-rx, y);

		// top side
		ctx.lineTo(x+rx, y);
		// top left side
		ctx.quadraticCurveTo(x, y, x, y+ry);

		ctx.closePath();
	}
};

Rect.prototype.rx = function(rx){
	return this._property('rx', rx);
};

Rect.prototype.ry = function(ry){
	return this._property('ry', ry);
};

$.fx.step.rx = $.fx.step.int;
$.fx.step.ry = $.fx.step.int;


//# Curves

//# Catmull-Rom Curves
Curve.curves.catmullRom = {

	params : function(){
		var from = this.from(),
			arg = this._arguments;
		return {
			x1  : from[0],
			y1  : from[1],
			x2  : arg[2],
			y2  : arg[3],
			h1x : arg[0],
			h1y : arg[1],
			h2x : arg[4],
			h2y : arg[5]
		};
	},

	pointAt : function(t){
		var p = this.params();
		return CRPoint( p.h1x, p.h1y, p.x1, p.y1, p.x2, p.y2, p.h2x, p.h2y, t );
	},

	tangentAt : function(t){
		var p = this.params();
		return Math.atan2(
			0.5 * ( 3*t*t*(-p.h1y+3*p.y1-3*p.y2+p.h2y) + 2*t*(2*p.h1y-5*p.y1+4*p.y2-p.h2y) + (-p.h1y+p.y2)  ),
			0.5 * ( 3*t*t*(-p.h1x+3*p.x1-3*p.x2+p.h2x) + 2*t*(2*p.h1x-5*p.x1+4*p.x2-p.h2x) + (-p.h1x+p.x2)  )
		) / Math.PI * 180;
	},

	process : function( ctx, current ){
		var point,
			a = this._arguments,
			i = 0,
			detail = this._detail;
		for(; i <= detail; i++){
			point = CRPoint( a[0], a[1], current[0], current[1], a[2], a[3], a[4], a[5], i / detail );
			ctx.lineTo( point.x, point.y );
		}
		return [ a[4], a[5] ];
	},
	_detail : 20,
	h1x : argument( 0 ),
	h1y : argument( 1 ),
	h2x : argument( 4 ),
	h2y : argument( 5 ),
	x   : argument( 2 ),
	y   : argument( 3 ),
	_slice : [ 4 ],

	toCubic : function(){}
};

function CRPoint(x1, y1, x2, y2, x3, y3, x4, y4, t){
	return {
		x: 0.5 * ((-x1 + 3*x2 - 3*x3 + x4)*t*t*t
				+ (2*x1 - 5*x2 + 4*x3 - x4)*t*t
				+ (-x1 + x3)*t
				+ 2*x2),
		y: 0.5 * ((-y1 + 3*y2 - 3*y3 + y4)*t*t*t
				+ (2*y1 - 5*y2 + 4*y3 - y4)*t*t
				+ (-y1 + y3)*t
				+ 2*y2)
	};
}

function argument( index ){
	return function( value ){
		return this.argument( index, value );
	};
}

$.CRPoint = CRPoint;
//# Bezier Curves
Curve.curves.bezier = {
	pointAt : function(t){},
	process : function( ctx, current ){
		var curx, cury,
			x = [ current[0] ].concat(getElements( this._arguments, 0 )),
			y = [ current[1] ].concat(getElements( this._arguments, 1 )),
			detail = this._detail,
			i = 0;
		for(; i <= detail; i++){
			curx = bezier( x, i / detail );
			cury = bezier( y, i / detail );
			ctx.lineTo( curx, cury );
		}
		return this._arguments.slice( this._arguments.length - 2 );
	},
	_detail : 50
};

function getElements( array, i ){
	// i = 0 -- odd
	// i = 1 -- even
	var result = [],
		l = array.length;
	for( ; i < l; i += 2 ){
		result.push( array[i] );
	}
	return result;
}

function factorial(n){
	if(n === 1 || n === 0) return 1;
		return n * factorial(n-1);
}

function C(i, m){
	return factorial(m) / (factorial(i) * factorial(m - i));
}

function bezier(points, t){
	var len = points.length,
		m = len - 1,
		i = 0,
		l = 1 - t,
		result = 0;
	for(; i < len; i++){
		result += C(i, m) * Math.pow(t, i) * Math.pow(l, m - i) * points[i];
	}
	return result;
}
//# Curves
Curve.detail = 10;
Curve.delta = 0.0001;

extend(Curve.prototype, {
	tangentAt : function(t, delta){
		if(delta === undefined)
			delta = Curve.delta;

		var t1 = t - delta,
			t2 = t + delta;

		if(t1 < 0)
			t1 = 0;
		if(t2 > 1)
			t2 = 1;

		var point1 = this.pointAt(t1),
			point2 = this.pointAt(t2);

		return Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
	},

	normalAt : function(t, delta){
		return this.tangentAt(t, delta) - 90;
	},

	nearest : function(x, y, detail){
		if(detail === undefined)
			detail = Curve.detail;

		var point, min = Infinity, minPoint, distance;
		for(var t = 0; t <= detail; t++){
			point = this.pointAt(t / detail);
			distance = Math.sqrt( Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2) );
			if(distance < min){
				min = distance;
				minPoint = point;
				minPoint.distance = distance;
				minPoint.t = t / detail;
			}
		}
		return minPoint;
	},

	approximate : function(detail){
		if(detail === undefined)
			detail = Curve.detail;

		var lines = [], last = this.pointAt(0), point;
		for(var t = 1; t <= detail; t++){
			point = this.pointAt(t / detail);
			// round coords?
			lines.push({ x1: last.x, y1: last.y, x2: point.x, y2: point.y });
			last = point;
		}
		return lines;
	},

	toLines : function(detail){
		if(detail === undefined)
			detail = Curve.detail;

		var curves = this.path._curves,
			index = curves.indexOf(this),
			lines = [],
			point;
		for(var t = 0; t <= detail; t++){
			point = this.pointAt(t / detail);
			lines.push( new Curve('lineTo', [point.x, point.y], this.path) );
		}
		curves.splice.apply(curves, [index, 1].concat(lines));
		return this.update();
	},

	length : function(detail){
		var lines = this.approximate(detail),
			length = 0;
		for(var i = 0, l = lines.length; i < l; i++){
			length += Math.sqrt( Math.pow(lines[i].x2 - lines[i].x1, 2) + Math.pow(lines[i].y2 - lines[i].y1, 2) );
		}
		return length;
	},

	_bounds : function(detail){
		if(!this.pointAt)
			return null;

		if(detail === undefined)
			detail = Curve.detail;

		var point,
			x1 =  Infinity,
			y1 =  Infinity,
			x2 = -Infinity,
			y2 = -Infinity;
		for(var t = 0; t <= detail; t++){
			point = this.pointAt(t / detail);
			if(point.x < x1)
				x1 = point.x;
			if(point.y < y1)
				y1 = point.y;
			if(point.x > x2)
				x2 = point.x;
			if(point.y > y2)
				y2 = point.y;
		}
		return new Bounds(x1, y1, x2 - x1, y2 - y1);
	},

	curvature : function(){
		return null;
	}
});

extend(Curve.curves.lineTo, {
	pointAt : function(t){
		var from = this.from();
		var to = this._arguments;
		return {
			x: (1 - t)*from[0] + t*to[0],
			y: (1 - t)*from[1] + t*to[1]
		};
	},

	tangentAt : function(){
		var from = this.from();
		var to = this._arguments;
		return Math.atan2( to[1] - from[1], to[0] - from[0] ) * 180 / Math.PI;
	},

	length : function(){
		var from = this.from();
		var to = this._arguments;
		return Math.sqrt( Math.pow(to[1] - from[1], 2) + Math.pow(to[0] - from[0], 2) );
	},

	curvature : function(){
		return 0;
	},

	divide : function(t){
		if(t);
		return [];
	},

	solve : function(coord){
		if('t' in coord)
			throw new Error('Use pointAt(t) function instead solve.');
		// solve({ x:5 }) -> {x, y, t}
		// solve({ y:100 }) -> {x, y, t}
		// solve({ x, y })
	}
});

extend(Curve.curves.quadraticCurveTo, {
	params : function(){
		var from = this.from(),
			arg = this._arguments;
		return {
			x1 : from[0],
			y1 : from[1],
			x2 : arg[2],
			y2 : arg[3],
			hx : arg[0],
			hy : arg[1]
		};
	},

	pointAt : function(t){
		var p = this.params(),
			i = 1 - t;
		return {
			x: (i*i*p.x1) + (2*t*i*p.hx) + (t*t*p.x2),
			y: (i*i*p.y1) + (2*t*i*p.hy) + (t*t*p.y2)
		};
	},

	tangentAt : function(t){
		var p = this.params(),
			i = 1 - t;
		return Math.atan2(-2*p.y1*i + 2*p.hy*(1-2*t) + 2*p.y2*t, -2*p.x1*i + 2*p.hx*(1-2*t) + 2*p.x2*t) / Math.PI * 180;
	},

	toCubic : function(c){
		if(c === undefined)
			c = 2/3;

		var p = this.params();

		this.name = 'bezierCurveTo';
		this._arguments = [
			p.x1 + c * (p.hx - p.x1),
			p.y1 + c * (p.hy - p.y1),
			p.x2 + c * (p.hx - p.x2),
			p.y2 + c * (p.hy - p.y2),
			p.x2, p.y2
		];
		extend(this, Curve.curves.bezierCurveTo);
		return this;
	}
});

extend(Curve.curves.bezierCurveTo, {
	params : function(){
		var from = this.from(),
			arg = this._arguments;
		return {
			x1  : from[0],
			y1  : from[1],
			x2  : arg[4],
			y2  : arg[5],
			h1x : arg[0],
			h1y : arg[1],
			h2x : arg[2],
			h2y : arg[3]
		};
	},

	pointAt : function(t){
		var p = this.params(),
			i = 1 - t;
		return {
			x: (i*i*i*p.x1) + (3*t*i*i*p.h1x) + (3*t*t*i*p.h2x) + t*t*t*p.x2,
			y: (i*i*i*p.y1) + (3*t*i*i*p.h1y) + (3*t*t*i*p.h2y) + t*t*t*p.y2
		};
	},

	tangentAt : function(t){
		var p = this.params(),
			i = 1 - t;
		return Math.atan2(
			-3*p.y1*i*i + 3*p.h1y*(i*i - 2*t*i) + 3*p.h2y*(2*t*i - t*t) + 3*t*t*p.y2,
			-3*p.x1*i*i + 3*p.h1x*(i*i - 2*t*i) + 3*p.h2x*(2*t*i - t*t) + 3*t*t*p.x2
			) / Math.PI * 180;
	},
});
// Arc
extend(Curve.curves.arc, {
	params : function(){
		var from = this.from(),
			arg = this._arguments;
		return {
			x1     : from[0],
			y1     : from[1],
			x2     : arg[0],
			y2     : arg[1],
			radius : arg[2],
			start  : arg[3],
			end    : arg[4],
			clockwise : arg[5]
		};
	},
	pointAt : function(){
		var p = this.params();
		return p;
	}
});


// ArcTo

		// pointAt: function(){},
		// tangentAt: function(){},
		// normalAt = auto
		// intersections: function(){},
		// toBezier: function(){},
		// approximate: function(){}, // by lines
		// bounds: function(){},
		// length: function(){},
		// divide: function(){},
		// nearest: function(){}, // nearest point
		// allPoints
	
//		TODO: animate by curve
// {{don't include paths.js}}

//# Animation
//# Animation
// 1. Path to path.
// 2. Move by path.
// 3. Gradient to gradient.

// Moving by path
$.fx.step.curve = function( fx ){
	if( fx.state === 0 ){
		if( !fx.elem._matrix )
			fx.elem._matrix = [1, 0, 0, 1, 0, 0];

		if( fx.elem._bounds || (fx.elem.bounds && fx.elem.bounds !== Shape.prototype.bounds) ){
			var b = fx.elem.bounds();
			fx.elem._matrix[4] -= b.cx;
			fx.elem._matrix[5] -= b.cy;
		}
	}

	if( fx.pointLast ){
		fx.elem._matrix[4] -= fx.pointLast.x;
		fx.elem._matrix[5] -= fx.pointLast.y;
	}
	var point = fx.end.pointAt(fx.pos);
	fx.elem._matrix[4] += point.x;
	fx.elem._matrix[5] += point.y;
	fx.pointLast = point;
};

$.fx.step.curveAngle = function( fx ){
	if( fx.state === 0 ){
		if( !fx.elem._matrix )
			fx.elem._matrix = [1, 0, 0, 1, 0, 0];

		if( fx.elem._bounds ){
			var b = fx.elem.bounds();
			fx.elem._matrix[4] -= b.cx;
			fx.elem._matrix[5] -= b.cy;
		}
	}

	if( fx.pointLast ){
		fx.elem._matrix[4] -= fx.pointLast.x;
		fx.elem._matrix[5] -= fx.pointLast.y;
		fx.elem.rotate(-fx.ang)
	}
	var point = fx.end.pointAt(fx.pos),
		angle = fx.end.tangentAt(fx.pos);
	fx.elem._matrix[4] += point.x;
	fx.elem._matrix[5] += point.y;
	fx.elem.rotate(angle);
	fx.pointLast = point;
	fx.ang = angle;
}; // -- bezier

//# Images

//# Filters
var nativeDraw = Img.prototype.draw;

Img.prototype.filter = function(filter, options){
	if(!this._image.complete){
		return this.on('load', function(){
			this.filter(filter, options);
		});
	}

	var data = this.context.context.getImageData(this._x, this._y, this._width, this._height);

	if( typeof filter !== 'function' ){

		if( $.filters[filter] === undefined ){
			throw new Error('Filter \"' + filter + '\" is not defined.');
		}
		
		filter = $.filters[filter];
	}

	if( filter.call(this, data.data, options || {}) !== false ){
		this._imageData = data;
		this.context.context.putImageData(data, this._x, this._y);
	}

	return this;
};

Img.prototype.draw = function(ctx){
	// unknown bug in Chrome 43
	if(this._imageData)
		ctx.putImageData(this._imageData, this._x, this._y);
	else
		nativeDraw.call(this, ctx);

	return this;
};

$.filters = {

	pixel : function(data, callback){
		var pixel,
			i = 0,
			l = data.length;

		for(; i < l; i += 4){
			pixel = callback(data[i], data[i+1], data[i+2], data[i+3], i);
			data[i]   = pixel[0];
			data[i+1] = pixel[1];
			data[i+2] = pixel[2];
			data[i+3] = pixel[3];
		}

	},

	vertex : function(data, callback){
		var pixel,
			w = this._width,
			h = this._height,
			result = this.context.context.createImageData(w, h),
			rdata = result.data,
			i = 0,
			l = data.length,
			idw = w / 4;
		for(; i < l; i += 4){
			pixel = callback(
				(i / 4) % w, Math.floor(i / 4 / w),
				data[i], data[i+1], data[i+2], data[i+3],
				i);
			pixel = (w * pixel[1] + pixel[0]) * 4;
			rdata[pixel] = data[i];
			rdata[pixel+1] = data[i+1];
			rdata[pixel+2] = data[i+2];
			rdata[pixel+3] = data[i+3];
		}
		this._imageData = result;
		this.update();
		return false;
	}

};
//# ImageAnim

$.Context.prototype.imageanim = function(){
	return this.push( new ImageAnim(arguments, this) );
};

$.multiplePath = function(path){
	var array = [],
		re = /\[(\d+)\-(\d+)\]/,
		match = path.match(re),
		from = Number(match[1]),
		to = Number(match[2]);
	for(; from <= to; from++)
		array.push( path.replace(re, from) );
	return array;
};

function genSequence(length){
	var array = [];
	while(length--)
		array[length] = length;
	return array;
}

var ImageAnim = $.Class(Img, {

	init : function(){
		var props = this._image;
		this._frames = [];
		this._sequences = [];

		if(isObject(props)){
			this._image = props.image;
			this._x = props.x;
			this._y = props.y;
			this._width = props.width;
			this._height = props.height;
			this._crop = props.crop;
			this._parseHash(props);
		}

		if(isString(this._image))
			this._image = $.multiplePath(this._image);

		var image;
		this._image.forEach(function(frame){
			if( isString(frame) ){
				// other types? svg, #id?
				image = new Image();
				image.src = frame;
				frame = image;
			}
			this._frames.push(frame);
		}.bind(this));

		this._image = this._frames[0];

		// image already loaded
		if(this._image.complete){
			s = this._computeSize(this._width, this._height, this._image);
			this._width = s[0];
			this._height = s[1];
		}

		this._image.addEventListener('load', function(e){
			s = this._computeSize(this._width, this._height, this._image);
			this._width = s[0];
			this._height = s[1];
			this.update();

			this.fire('load', e);
		}.bind(this));

		this._image.addEventListener('error', function(e){
			this.fire('error', e);
		}.bind(this));
	},

	_startFrame: 0,

	frame : function(frame){
		if(frame === undefined)
			return this._frame;

		// wtf?
//		if(!this._frames[frame].complete)
//			return this._frames[frame].addEventListener('load', function(){ this.frame(frame); }.bind(this));

		this._frame = frame;
		this._image = this._frames[frame];
		this.fire('frame', {frame:frame});
		return this.update();
	},

	nextframe : function(){
		return this.frame(this._frame === this._frames.length-1 ? 0 : this._frame + 1);
	},

	prevframe : function(){
		return this.frame(this._frame === 0 ? this._frames.length-1 : this._frame - 1);
	},

	sequence : function(name, frames){
		this._sequences[name] = frames;
	},

	play : function(sequence, fps, loop, callback){
		if(isString(sequence))
			sequence = this._sequences[sequence];

		if(!sequence)
			sequence = genSequence(this._frames.length);

		if(!fps)
			fps = 60;

		if(typeof loop === 'function')
			callback = loop,
			loop = true;

		if(loop === undefined)
			loop = true;

		if(callback === undefined)
			callback = emptyFunc;

		var i = 0;
		if(fps < 0){
			i = sequence.length-1;
			this._timer = window.setInterval(function(){
				if(i === 0)
					!loop ? callback.call(this.stop()) : ((i = sequence.length-1), callback.call(this));
				this.frame(sequence[i--]);
			}.bind(this), -fps);
		}
		else {
			this._timer = window.setInterval(function(){
				if(sequence.length === i)
					!loop ? callback.call(this.stop()) : ((i = 0), callback.call(this));
				this.frame(sequence[i++]);
			}.bind(this), fps);
		}
	},

	stop : function(){
		window.clearInterval(this._timer);
		this._timer = null;
		return this;
	},

	toggle : function(){
		if( this._timer === null )
			this.play.apply(this, arguments);
		else
			this.stop();
		return this;
	},

	isPlaying : function(){
		return this._timer !== null;
	},

	_frame : 0
});

ImageAnim.props = [ 'image', 'x', 'y', 'width', 'height', 'crop' ];
ImageAnim.distances = [false, true, true, true, true]; // TODO: check on errors! 'auto', 'native' values?
// {{don't include sprite.js}}
// {{don't include composites.js}}

//# SVG

// {{don't include svgpath.js}}


//# Utilities

var elProto = window.Element.prototype,
	prefix,
	funcName = 'requestFullScreen',
	cancName = 'cancelFullScreen',
	eventName = 'fullscreenchange',
	elementName = 'fullScreenElement',
	enabledName = 'fullScreenEnabled';

if('mozRequestFullScreen' in elProto)
	prefix = 'moz';
else if('webkitRequestFullScreen' in elProto)
	prefix = 'webkit';

if(prefix){
	funcName = camelPrefix(prefix, funcName);
	cancName = camelPrefix(prefix, cancName);
	eventName = prefix + eventName;
	elementName = camelPrefix(prefix, elementName);
	enabledName = camelPrefix(prefix, enabledName);
}

Context.prototype.fullscreen = function(resizecanvas){
	if(this.isFullscreen())
		return;

	this.canvas[funcName]();
	if(resizecanvas){
		this.normalState = {
			width: this.canvas.width,
			height: this.canvas.height
		};
		setTimeout(function(){
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.update();
		}.bind(this), 10);

		this._resizeListener = function(e){
			if(document[elementName] === null){
				document.removeEventListener(eventName, this._resizeListener);
				this.fire('exitfull', e);
				this.canvas.width = this.normalState.width;
				this.canvas.height = this.normalState.height;
				this.normalState = null;
				this._resizeListener = null;
				this.update();
			}
		}.bind(this);
		document.addEventListener(eventName, this._resizeListener);
	}
	else {
		this._resizeListener = function(e){
			if(document[elementName] === null){
				document.removeEventListener(eventName, this._resizeListener);
				this.fire('exitfull', e);
			}
		}.bind(this);
		document.addEventListener(eventName, this._resizeListener);
	}
	this.fire('fullscreen'); // TODO: move this to the listener
};

Context.prototype.isFullscreen = function(){
	return document[elementName] === this.canvas;
};

Context.prototype.exitfull = function(){
	if(!this.isFullscreen())
		return;

	document[cancName]();
	this.fire('exitfull');
	if(this._resizeListener){
		document.removeEventListener(eventName, this._resizeListener);
		this._resizeListener = null;
	}
	if(this.normalState){
		this.canvas.width = this.normalState.width;
		this.canvas.height = this.normalState.height;
		this.normalState = null;
		this.update();
	}
};

function camelPrefix(prefix, name){
	return prefix + name[0].toUpperCase() + name.substr(1);
}

if(!prefix && !('requestFullScreen' in elProto)){
	// Fullscreen API isn't supported.
	Context.prototype.fullscreen = function(){};
	Context.prototype.isFullscreen = function(){};
	Context.prototype.exitfull = function(){};
}
// {{don't include layers.js}}
// {{don't include particles.js}}
// {{don't include camera.js}}
// {{don't include events_keyboard.js}}

$.Ellipse = Ellipse;
$.Polygon = Polygon;
$.Star = Star;
$.ImageAnim = ImageAnim;

})( typeof window !== 'undefined' ? window : this, Graphics2D );