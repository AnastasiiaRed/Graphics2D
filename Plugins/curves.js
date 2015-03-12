/*! Graphics2D Curves 1.0
 *  Author: Keyten aka Dmitriy Miroshnichenko
 *  License: MIT / LGPL
 */
(function(window, $, undefined){

	var extend = Graphics2D.util.extend;

	// todo: from parameter in path curves
	extend(Graphics2D.Curve.prototype, {
		tangentAt : function(t, delta){
			if(delta === undefined)
				delta = 0.0001;

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
			return this.tangentAt(t, delta) + 90;
		},

		nearest : function(x, y, detail){
			if(detail === undefined)
				detail = 10;

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
				detail = 10;

			var lines = [], detail, last = this.pointAt(0);
			for(var t = 1; t <= detail; t++){
				point = this.pointAt(t / detail);
				// round coords?
				lines.push({ x1: last.x, y1: last.y, x2: point.x, y2: point.y });
				last = point;
			}
			return lines;
		},

		length : function(detail){
			if(detail === undefined)
				detail = 10;

			var lines = this.approximate(detail),
				length = 0;
			for(var i = 0, l = lines.length; i < l; i++){
				length += Math.sqrt( Math.pow(lines[i].x2 - lines[i].x1, 2) + Math.pow(lines[i].y2 - lines[i].y1, 2) );
			}
			return length;
		}
	});

	extend(Graphics2D.Path.curves.lineTo.prototype, {
		pointAt : function(t){
			var from = this._from;
			var to = this._arguments;
			return {
				x: (1 - t)*from[0] + t*to[0],
				y: (1 - t)*from[1] + t*to[1]
			};
		},

		tangentAt : function(){
			var from = this._from;
			var to = this._arguments;
			return Math.atan2( to[1] - from[1], to[0] - from[0] ) * 180 / Math.PI;
		},

		length : function(){
			var from = this._from;
			var to = this._arguments;
			return Math.sqrt( Math.pow(to[1] - from[1], 2) + Math.pow(to[0] - from[0], 2) );
		}
	});

	extend(Graphics2D.Path.curves.quadraticCurveTo.prototype, {
		pointAt : function(t){
			var fx = this._from[0],
				fy = this._from[1],
				hx = this._arguments[0],
				hy = this._arguments[1],
				tx = this._arguments[2],
				ty = this._arguments[3];
			var i = 1 - t;
			return {
				x: (i*i*fx) + (2*t*i*hx) + (t*t*tx),
				y: (i*i*fy) + (2*t*i*hy) + (t*t*ty)
			};
		}
	});

	extend(Graphics2D.Path.curves.bezierCurveTo.prototype, {
		pointAt : function(t){
			var fx = this._from[0],
				fy = this._from[1],
				h1x = this._arguments[0],
				h1y = this._arguments[1],
				h2x = this._arguments[2],
				h2y = this._arguments[3],
				tx = this._arguments[4],
				ty = this._arguments[5];
			var i = 1 - t;
			return {
				x: (i*i*i*fx) + (3*t*i*i*h1x) + (3*t*t*i*h2x) + t*t*t*tx,
				y: (i*i*i*fy) + (3*t*i*i*h1y) + (3*t*t*i*h2y) + t*t*t*ty
			};
		}
	});
	// Arc

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

/*
	// Quadratic to Cubic
	$.quadratic2cubic = function(fx, fy, tx, ty, hx, hy){
		return {
			fx: fx, fy: fy,
			tx: tx, ty: ty,
			h1x: fx + 2/3*(hx-fx), h1y: fy + 2/3*(hy-fy),
			h2x: tx + 2/3*(hx-tx), h1y: ty + 2/3*(hy-ty)
		};
	}; */

})(window, Graphics2D.Path.curves);