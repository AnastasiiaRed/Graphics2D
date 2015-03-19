## Graphics2D.Shape

`Graphics2D.Shape` -- ������, �� �������� ����������� ������ �������� (`Rect`, `Circle`, `Path`, `Image`, `Text`, `TextBlock`) �������.

### ��������
�� ���� �������� ������� ���������� ��������� ������ �������, 2 ��������� ��������� -- ������� � ������� (fill, stroke). ��� ���������� ����� ��������� null.
��������� ��������. ������:
```js
ctx.rect(10, 10, 200, 200, 'black', '2px black round');
ctx.rect(200, 200, 30, 30, null, '5pt green');
```
�� ���� �������� �� ������� ������� ��������� ����� ������, � ����� - ������� � �������. ��������� ������� ��������� ���� �����. � �������.

����� ����� ��������� ������� �����:
```js
ctx.rect({
  x: 10,
  y: 10,
  width: 200,
  height: 200,
  fill: 'black',
  
  opacity:0.8,
  composite:'xor'
});
```
���� ������� ��������� ������������ �������������� ���������: `opacity`, `composite`, `visible`, `clip`.

���� �� ��������� �� �������, �� �������, ������ ����� ������ ��������� �����������, �� ��� ���� ����� �������, � ����� ����������� �� ������� ���� (����������� �������� `mouse`).

����� ����������� ���������� ����� ��������� CSS-����������:
```js
ctx.rect('10pt', '10pt', '0.5em' '1em');
```

### ������:

����������� ��� ��������� ������� "jQuery-way": ������ 2 ������� "getAttr" � "setAttr" ����� ������������ ���� ������� "attr", ������� ���� ���� ��-������� � ����������� �� ����������. ����� �� ������������ ������� ������� (`shape.fill = 'red'`) ������ � ���, ��� ��������� ������ �������� �������� ����������� ���������, � ������������ ��������� ��� �������� ������ ����� ������� / ������� ES5.

������ �����, ������������� ������� ������ ������� ��������� ������������ "�������":
```js
shape.fill('red').stroke('blue 2px').opacity(0.3).show();
```

#### fill
������� �������:
```js
rect.fill('red');
rect.fill(); // -> 'red'
```
������ �� ��������� `colors` �������������� ��� ��������:
```js
rect.fill({ colors:['red', 'green', 'black'], from:'top', to:'bottom' });
rect.fill().from(); // -> 'top'
```
���� ��������� ������ �� ��������� `image`, ��� �� ������, ������������ � `http://`, `.` ��� `data`, �������������� ��� �������� (������������� �������).
```js
rect.fill('./image.jpg');
```
�� ����������� �������� � ��������� -- � �� �������.

#### stroke
������� �������:
```js
rect.stroke();
// -> {color, width, cap, join, dash}
rect.stroke('5px'); // ���������� ������ ��������� ���������
rect.stroke('7pt red');
rect.stroke();
// -> {color:'red', width:9} -- ������ ������ ������������ � ��������
```
��������� ���������:
- `width` / ������ -- `2px`, `0.5em`, `8` � �.�.
- `color` / ���� -- `#f00`, `green`, `rgb(0,0,0)` � �.�.
- `join`  / ��� ���������� -- `miter`, `bevel`, `round`.
- `cap`   / ��� ���������� -- `butt`, `square`, `round`.
- `dash`  / ������� -- `[1,2,2]`, `shortdash`, `shortdot`, `shortdashdot`, `shortdashdotdot`, `dot`, `dash`, `longdash`, `dashdot`, `longdashdot`, `longdashdotdot`.
- ������������ -- `0.5`, `.3` -- ������ ������ float, ����������� ������ � ��������� ��������, ����������� ����� �� (������� ��� �������� -- ��������, `green 0.5` ������ `rgba(0, 128, 0, 0.5)`).

```js
rect.stroke('0.5em round square [1,2] green 0.5');
```

����� �������� �������� �� �����:
```js
rect.stroke({ color:'black', width:'4px', cap:'butt', join:'round', dash:'dot' });
```

�������� ������������ ���������� `null` ���������� ��� ���������.

#### opacity
������������ (����� �� 0 �� 1).

#### composite
������� ��������� �������� ���� �� �����. ��������: `source-over`, `source-atop`, `source-in`, `source-out`, `destination-over`, `destination-atop`, `destination-in`, `destination-out`, `lighter`, `darker`, `copy`, `xor`.

��������� �������� ������������ ������� ������ (`normal`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`, `hue`, `saturation`, `color`, `luminosity`).

��������: http://dev.w3.org/fxtf/compositing-1
MDN: http://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing

#### hide, show
������ ������ ������� / ���������. ��� ��������, ������ ��������� ��� ���������.

#### cursor
������������� ������ ��� ��������� ���� �� ������. *(���� �������� �� ������ ���������)*
```js
rect.cursor('pointer');
```

#### z
Z-index �������.

Z-index � ������� Graphics2D -- ������ ������ �������� (�, ��������������, � ����� �� ����� ��������������):
```js
var a = ctx.rect(10, 10, 200, 200);
var b = ctx.circle(100, 100, 50);
a.z(); // -> 0
b.z(); // -> 1

b.z(0);
b.z(); // -> 0
a.z(); // -> 1
```
���� �������� � ���������� �������� ������������ �� ����� ��������� �� �����.

#### isPointIn(x, y)
���������� `true`, ���� ����� `(x; y)` ��������� ������ �������, ����� `false`.

#### bounds
���������� ������������� (�������) �������. ��������:
 - `x`, `y` = `x1`, `y1` -- ���������� ����� ������� �����.
 - `x2`, `y2` -- ���������� ������ ������ �����.
 - `width`, `height` = `w`, `h` -- ������ � ������.
 - `cx`, `cy` -- ���������� ������.

����� ����� �������� ������ �� ��������� `transform` (true / false) � `stroke` (true / false / 'exclude') -- ������������ �� ������������� � ������� ('exclude' ��������� ������� ������� �� �������):
```js
var bounds1 = shape.bounds(),
    bounds2 = shape.bounds({ transform: false });
```
�� ��������� `transform: true, stroke: false`.

#### corner
���������� ���������� ������ �� ����� �������:
```js
var coords = shape.corner('left top');
// -> [x, y]
```
����� ����� �������� ������ �� ��������� `from` � �������� �� ����:
```js
shape.corner({ from: 'left top', x: 10, y: 50 });
// -> [x + 10, y + 50]
```

��������� ��������: ���� (`left top`, `right top`, `left bottom`, `right bottom`), �������� ������������ ���� (`left top` = `top left`), �������� ���������� (`left top` = `lt` = `tl`), ����� ���� �������� ������ (`left`, `top`, `right`, `bottom`) � ����� (`center`).

#### clip
����� ������� (������, ���������� ����� ��������� �������).

����� �������� ����� ������ ��������� *(������ ��������� ����� `processPath`)*:
```js
shape.clip( ctx.path( [ [0, 0], [100, 100], [200, 0] ] ) );
```

4 ��������� ��������� ������������ �������������� (x, y, width, height) � ���������� ����������� (����������� canvas-�, � �� ����������� ������ �������):
```js
shape.clip( 0, 0, 30, 30 );
```
3 ��������� -- ���������� �����:
```js
shape.clip( 50, 50, 100 );
```
1 �������� -- ����:
```js
shape.clip([ [0, 0], [200, 200], [200, 0] ] );
```
��� ���� �������:
```js
shape.clip({
	processPath: function(ctx){
		// ctx -- ����������� 2D Context
		ctx.moveTo( 10, 10 );
		ctx.lineTo( 300, 300 );
		ctx.lineTo( 300, 0 );
		ctx.closePath();
	}
});
```

���������� ������ ���������� `null` ������� �����.

#### remove
������� ������ �� ��������� ��������� (�� ��� ���� ������ ������� � ������, ��� ��� ��� ����� ������������ � ����������, � �.�. �������� ������� � ��������):
```js
var rect = ctx.rect( 100, 100, 50, 50, 'blue' );
rect.remove();

rect.x(); // -> 100

ctx.push( rect ); // ���������� ������ � ��������
```

#### shadow
����. ����� �������� ������ � �����������:
```js
shape.shadow({ x: 0, y: 5, blur: 5, color: 'black', opacity: 0.5 });
```

����� ���������� � CSS-����� (x y blur color):
```js
shape.shadow('0 2px 2px red');
```

�������� � �������� ��������� �� ����������� (�������� ��������� ������������ � ��������):
```js
shape.shadow('blur'); // -> 2
shape.shadow('blur', 5);
```

### �������
������� `on(event, func)`, `off(event, [func])`, `fire(event, [object])`, � ����� ������ `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseover`, `mouseout`, `mousewheel`, `focus`, `blur` �������� ��������� ���������� ��������������� �������� ���������, �� � ������ ���� �� ��������� � ����������.

mouse

### �������������
��� ������������� (����� `translate`) ��������� �������� `pivot` -- ����� ������������� (��������, � ������ � `rotate` -- ������ ����� ����� ���������� ��������). ����� �������� ��� ���������� ���������� (`[0,0]`, `{x:10, y:10}`), ��� � ���� �� ����� ������: `left`, `right`, `top`, `bottom`, `left top` / `top left` / `lt` / `tl` � �.�.

�� ��������� ����� -- ����� ������.
#### scale
```js
rect.scale(2);
rect.scale(0.5, 0.5);
rect.scale(2, 'left top');
rect.scale(0.5, 0.5, 'center');
```
����������� ������, ����� �������� ��� �� x,y ������ �������, ��� � ����������.

#### rotate
```js
rect.rotate(45);
rect.rotate(10, 'left');
```
������������ ������, ����������� ������� (����� ��������� ������� � ������� ��� `degree / 180 * Math.PI`, � ��������� �������� `rad / Math.PI * 180`).

#### skew
```js
rect.skew(10, 0);
rect.skew(5);
rect.skew(-10, 0, 'left');
rect.skew(-5, 'top');
```
"��������" ������. ����������� �������.

#### translate(x, y)
```js
rect.translate(10, 10);
```
�������� ������ �� ���� ���������. �������, ����� �� ��-������� ���������������� ������, � �� ��������� ��� ���������, � ������� ��������� � ��������� ���� ��� ������� ����������� ���������.

#### transform
```js
rect.transform(2, 0, 0, 1.5, 0, 0); // ������ ������
rect.transform(0.5, 0, 0, 0.75, 0, 0, 'top');
```
�������������� ������. ��� ��� ��������, ��������� �����: http://www.intuit.ru/studies/courses/1063/210/lecture/5434?page=5

### ��������
������� `animate`:
```js
rect.animate('width', '2em');
// param, value, duration, easing, after
rect.animate('width', 200,  3000, 'bounceOut', function(){ this.fill('blue'); });

rect.animate({ width:200, x:0 }, 3000, 'bounceOut', afterfunc);
rect.animate({ fill: 'red', stroke:'4px' }, {
 duration: 1000,
 easing: function(x){ return Math.pow(x, 4) },
 after: function(){ this.hide() }
});
```
����� �� �� �������. ��������� ��������� ��� ������������:
- `opacity`
- `fill` (��� ��������� ���������� � �������)
- `stroke` (������ ���� � ������)
- `crop` -- ��� �����������
- `x`, `y`, `width`, `height`, `cx`, `cy`, `radius` -- ��������� �����
- `rotate`, `scale`, `scaleX`, `scaleY`, `skew`, `skewX`, `skewY`, `translate`, `translateX`, `translateY` -- �������������. ��� ������ ������ ������ ������, ��-������� ���� �����. ��� ���: `skew:[10,3]` ������ ������ (���� ���), ����� ���: `skewX:10, skewY:3`.

����� �������� ����...