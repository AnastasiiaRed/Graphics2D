// A file with demos for the site
var demos = {
	'Moving along curve': {
		description: 'Change the position: <input type="range" onMouseMove="demo.onValueChange(+this.value)" min="0" max="1" step="0.01" value="0.5"/><br/><i>Note: if you want to animate element, there\'s a simpler way. Watch the next demo.</i>',
		init: function(ctx){
			var path = ctx.path([
				[100, 100],
				[200, 150, 250, 50, 400, 200]
			], null, 'white 2px');

			var curve = path.curve(1);
			var circle = ctx.circle(0, 0, 7, 'red');

			demo.onValueChange = function(value){
				var point = curve.pointAt(value);
				circle.attr({
					cx: point[0],
					cy: point[1]
				});
			};

			demo.onValueChange(0.5);
		}
	},

	'Morphing curves': {
		description: 'Morphing bezier curve into lagrange curve',
		init: function(ctx){
			var path = ctx.path([
				[100, 100],
				[200, 50, 250, 50, 400, 200]
			], null, 'white 2px');

			path.animate('morph', {
				curve: path.curve(1),
				to: ['lagrange', 200, 250, 250, 50, 400, 200],
				detail: 100
			}, 2500, 'sine');
		}
	},

	'Bezier Curve Editing': {
		init: function(ctx){
			// todo: запускать teardownListeners в reset
			var path = ctx.path([
				[100, 100],
				[200, 150, 250, 50, 400, 200]
			], null, 'white 2px');

			var move = path.curve(0);
			var curve = path.curve(1);

			function Control(x, y, index){
				this.index = index;
				this.mouseDown = false;

				this.element = ctx.circle(x, y, 4, 'red', 'red 9px 0.3');
				this.element.on('mouseover', 'attr', 'stroke', '0.5');
				this.element.on('mouseout', 'attr', 'stroke', '0.3');
				this.element.attr('interactionProps', {
					stroke: true
				});

				this.addListeners();
			}

			Control.prototype = {
				addListeners: function(){
					this.onMouseDown = e => {
						this.mouseDown = true;
					};

					this.onMouseMove = e => {
						if(this.mouseDown){
							var coords = ctx.contextCoords(e.clientX, e.clientY);
							this.element.attr({
								cx: coords[0],
								cy: coords[1]
							});

							if(this.index > -1){
								var args = curve.attr('args');
								args[2 * this.index] = coords[0];
								args[2 * this.index + 1] = coords[1];
								curve.attr('args', args);
							} else {
								move.attr({
									x: coords[0],
									y: coords[1]
								});
							}
						}
					};

					this.onMouseUp = e => {
						this.mouseDown = false;
					};

					this.element.on('mousedown', this.onMouseDown);
					this.element.on('dblclick', this.onDblClick);
					window.addEventListener('mousemove', this.onMouseMove);
					window.addEventListener('mouseup', this.onMouseUp);
				},

				// we don't want memory leaks
				teardownListeners: function(){
					window.removeEventListener('mousemove', this.onMouseMove);
					window.removeEventListener('mouseup', this.onMouseUp);
				}
			};

			new Control(100, 100, -1);
			new Control(200, 150, 0);
			new Control(250, 50, 1);
			new Control(400, 200, 2);
		}
	},

	'Lagrange Curve': {
		description: 'Click to switch the point',

		init: function(ctx){
			// the code below will be shown
			var mousePoint = ctx.circle(0, 0, 4, 'red', 'red 9px 0.3');
			var path = ctx.path([
				[100, 100],
				['lagrange', 200, 150, 250, 50, 400, 200]
			], null, 'white 2px');
			var curve = path.curve(1);

			var point = 0;

			// toggles point between 0 and 1
			ctx.click(e => {
				if(point === 0){
					point = 1;
				} else {
					point = 0;
				}
			});

			ctx.mousemove(e => {
				var points = curve.attr('args');
				points[point * 2 + 0] = e.contextX;
				points[point * 2 + 1] = e.contextY;
				curve.attr('args', points);

				mousePoint.attr({
					cx: e.contextX,
					cy: e.contextY
				});
			});
		},

		reset: function(ctx){
			// resets the demo
			ctx.elements[0].remove();
			ctx.off('click');
			ctx.off('mousemove');
		}
	},

	'Lagrange Curve Editing': {
		description: 'Click to add point, double click to remove',

		init: function(ctx){
			var path = ctx.path([
				[100, 100],
				['lagrange', 200, 150, 250, 50, 400, 200]
			], null, 'white 2px');

			var move = path.curve(0);
			var curve = path.curve(1);

			var controls;

			function Control(x, y, index){
				this.index = index;
				this.mouseDown = false;

				this.element = ctx.circle(x, y, 4, 'red', 'red 9px 0.3');
				this.element.on('mouseover', 'attr', 'stroke', '0.5');
				this.element.on('mouseout', 'attr', 'stroke', '0.3');
				this.element.attr('interactionProps', {
					stroke: true
				});

				this.addListeners();
			}

			Control.prototype = {
				addListeners: function(){
					this.onMouseDown = e => {
						e.cancelContextPropagation();
						this.mouseDown = true;
					};

					this.onMouseMove = e => {
						if(this.mouseDown){
							var coords = ctx.contextCoords(e.clientX, e.clientY);
							this.element.attr({
								cx: coords[0],
								cy: coords[1]
							});

							if(this.index > -1){
								var args = curve.attr('args');
								args[2 * this.index] = coords[0];
								args[2 * this.index + 1] = coords[1];
								curve.attr('args', args);
							} else {
								move.attr({
									x: coords[0],
									y: coords[1]
								});
							}
						}
					};

					this.onMouseUp = e => {
						this.mouseDown = false;
					};

					this.onDblClick = e => {
						this.element.remove();
						this.teardownListeners();

						var args = curve.attr('args');
						args.splice(2 * this.index, 2);
						curve.attr('args', args);
						controls.splice(this.index + 1, 1);

						for(var i = this.index + 1; i < controls.length; i++){
							controls[i].index--;
						}
					}

					this.element.on('mousedown', this.onMouseDown);
					this.element.on('dblclick', this.onDblClick);
					window.addEventListener('mousemove', this.onMouseMove);
					window.addEventListener('mouseup', this.onMouseUp);
				},

				// we don't want memory leaks
				teardownListeners: function(){
					window.removeEventListener('mousemove', this.onMouseMove);
					window.removeEventListener('mouseup', this.onMouseUp);
				}
			};

			controls = [
				new Control(100, 100, -1),
				new Control(200, 150, 0),
				new Control(250, 50, 1),
				new Control(400, 200, 2)
			];

			// Add a point after click
			ctx.mousedown(e => {
				var args = curve.attr('args');
				var index = args.length / 2;

				args.push(e.contextX);
				args.push(e.contextY);
				curve.attr('args', args);

				controls.push(new Control(e.contextX, e.contextY, index));
			});

			curve.attr('detail', 100);
		}
	}
};